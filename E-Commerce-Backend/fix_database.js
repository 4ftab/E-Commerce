// ============================================================
// One-time database repair script.
//
//   cd E-Commerce-Backend
//   node fix_database.js
//
// Why it exists: setup.sql uses INSERT IGNORE, so if your `products` table
// already had rows (or an older version of the table without the image /
// rating / reviews / stock columns) the unique images never got saved.
// This script is safe to run more than once.
// ============================================================
const mysql = require("mysql2/promise");
require("dotenv").config();

// Yoga Mat and Running Shorts use local illustrations served by the frontend
// (frontend/public/images/products/) so they never depend on an external link.
const IMAGES = {
    "Wireless Headphones":   "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    "Smart Watch Pro":       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    "Wireless Mouse":        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
    "Classic White T-Shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    "Denim Jacket":          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    "Premium Sneakers":      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    "Running Shoes":         "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600",
    "Modern Table Lamp":     "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
    "Ceramic Coffee Mug":    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600",
    "Luxury Face Cream":     "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600",
    "Skincare Gift Set":     "https://images.unsplash.com/photo-1556228720-da1ed2c3f9ef?w=600",
    "Leather Handbag":       "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
    "Classic Sunglasses":    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
    "Yoga Mat Premium":      "/images/products/yoga-mat.svg",
    "Running Shorts":        "/images/products/running-shorts.svg"
};

// column name -> definition to add if it is missing
const REQUIRED_COLUMNS = {
    image:   "VARCHAR(500) DEFAULT NULL",
    rating:  "DECIMAL(3,1) DEFAULT 4.5",
    reviews: "INT DEFAULT 0",
    stock:   "TINYINT(1) DEFAULT 1"
};

(async () => {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    // 1. Make sure the products table has every column the app reads
    const [cols] = await db.query(
        "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'",
        [process.env.DB_NAME]
    );
    const existing = cols.map((c) => c.COLUMN_NAME.toLowerCase());

    for (const [name, def] of Object.entries(REQUIRED_COLUMNS)) {
        if (!existing.includes(name)) {
            await db.query(`ALTER TABLE products ADD COLUMN ${name} ${def}`);
            console.log(`+ added missing column products.${name}`);
        }
    }

    // 2. Give every known product its own image
    for (const [name, url] of Object.entries(IMAGES)) {
        const [r] = await db.query("UPDATE products SET image = ? WHERE name = ?", [url, name]);
        if (r.affectedRows) console.log(`✓ image set for "${name}"`);
    }

    // 3. Merge duplicate cart rows (same product added twice -> one row)
    const [dups] = await db.query(`
        SELECT cart_id, product_id, MIN(id) AS keep_id, SUM(quantity) AS total, COUNT(*) AS n
        FROM cart_items
        GROUP BY cart_id, product_id
        HAVING n > 1
    `);
    for (const d of dups) {
        await db.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [d.total, d.keep_id]);
        await db.query(
            "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ? AND id <> ?",
            [d.cart_id, d.product_id, d.keep_id]
        );
        console.log(`✓ merged duplicate cart rows for product ${d.product_id}`);
    }

    // 4. Report anything still without an image
    const [missing] = await db.query("SELECT id, name FROM products WHERE image IS NULL OR image = ''");
    if (missing.length) {
        console.log("\nProducts that still have NO image (name not in the list above):");
        missing.forEach((p) => console.log(`  #${p.id} ${p.name}`));
    } else {
        console.log("\nAll products have an image.");
    }

    await db.end();
})().catch((err) => {
    console.error("fix_database failed:", err.message);
    process.exit(1);
});