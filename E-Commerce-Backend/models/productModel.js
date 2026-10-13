const db = require("../config/db");

// FIX: the old query only returned id, name, price and category.
// It never selected `image`, `rating`, `reviews` or `stock`, so the frontend
// never received an image and showed its fallback picture on EVERY product.
const getAllProducts = (callback) => {

    const sql = `
        SELECT
            products.id,
            products.name,
            products.price,
            products.image,
            products.rating,
            products.reviews,
            products.stock,
            products.category_id,
            categories.name AS category_name
        FROM products
        LEFT JOIN categories
            ON products.category_id = categories.id
        ORDER BY products.id
    `;

    db.query(sql, (err, results) => {
        callback(err, results);
    });
};

const getProductById = (id, callback) => {

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        callback(err, results);
    });
};

const createProduct = (name, price, categoryId, image, callback) => {
    const sql = `
        INSERT INTO products (name, price, category_id, image)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, price, categoryId, image || null],
        (err, result) => {
            callback(err, result);
        }
    );
};

const updateProduct = (id, name, price, categoryId, image, callback) => {
    // COALESCE keeps the existing image when none is sent in the request
    const sql = `
        UPDATE products
        SET name = ?, price = ?, category_id = ?, image = COALESCE(?, image)
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, price, categoryId, image || null, id],
        (err, result) => {
            callback(err, result);
        }
    );
};

const deleteProduct = (id, callback) => {

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        callback(err, result);
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};