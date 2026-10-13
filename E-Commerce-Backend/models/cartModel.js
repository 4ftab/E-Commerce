const db = require("../config/db");


// Find the cart of a user
const getCartByUserId = (userId, callback) => {

    const sql = `
        SELECT id, user_id, created_at
        FROM carts
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {
        callback(err, results);
    });
};


// Create a new cart for a user
const createCart = (userId, callback) => {

    const sql = `
        INSERT INTO carts (user_id)
        VALUES (?)
    `;

    db.query(sql, [userId], (err, result) => {
        callback(err, result);
    });
};


// Return the user's cart id, creating the cart first if it doesn't exist.
// FIX: previously "Add to cart" failed with 404 "Cart not found" whenever the
// user had no cart row (e.g. restored session, user created before carts
// existed, or the silent createCart() call on login failed).
const ensureCart = (userId, callback) => {

    getCartByUserId(userId, (err, results) => {
        if (err) return callback(err);

        if (results.length > 0) {
            return callback(null, results[0].id);
        }

        createCart(userId, (err, result) => {
            if (err) {
                // Another request may have created it a split second ago
                // (user_id is UNIQUE) - look it up again before giving up.
                return getCartByUserId(userId, (err2, again) => {
                    if (err2 || again.length === 0) return callback(err);
                    callback(null, again[0].id);
                });
            }

            callback(null, result.insertId);
        });
    });
};


// Add product to cart.
// FIX: if the product is already in the cart, increase its quantity instead of
// inserting a duplicate row (duplicates broke the + / - buttons because the
// frontend only ever found the first row).
const addCartItem = (cartId, productId, quantity, callback) => {

    const findSql = `
        SELECT id
        FROM cart_items
        WHERE cart_id = ? AND product_id = ?
        ORDER BY id
        LIMIT 1
    `;

    db.query(findSql, [cartId, productId], (err, rows) => {
        if (err) return callback(err);

        if (rows.length > 0) {
            const updateSql = `
                UPDATE cart_items
                SET quantity = quantity + ?
                WHERE id = ?
            `;

            return db.query(updateSql, [quantity, rows[0].id], (err, result) => {
                if (err) return callback(err);
                callback(null, { insertId: rows[0].id, merged: true });
            });
        }

        const insertSql = `
            INSERT INTO cart_items
            (cart_id, product_id, quantity)
            VALUES (?, ?, ?)
        `;

        db.query(insertSql, [cartId, productId, quantity], (err, result) => {
            callback(err, result);
        });
    });
};


// Get all items in a cart
// FIX: also returns image + category so the cart drawer can show the real
// product picture (it used to show one hard-coded fallback image).
const getCartItems = (cartId, callback) => {

    const sql = `
        SELECT
            cart_items.id,
            cart_items.product_id,
            products.name,
            products.price,
            products.image,
            categories.name AS category,
            cart_items.quantity
        FROM cart_items
        INNER JOIN products
            ON cart_items.product_id = products.id
        LEFT JOIN categories
            ON products.category_id = categories.id
        WHERE cart_items.cart_id = ?
        ORDER BY cart_items.id
    `;

    db.query(sql, [cartId], (err, results) => {
        callback(err, results);
    });
};


// Update quantity - FIX: only touches items that belong to THIS user's cart
// (before, any logged-in user could change anybody's cart item by id).
const updateCartItem = (id, userId, quantity, callback) => {

    const sql = `
        UPDATE cart_items
        INNER JOIN carts ON cart_items.cart_id = carts.id
        SET cart_items.quantity = ?
        WHERE cart_items.id = ? AND carts.user_id = ?
    `;

    db.query(sql, [quantity, id, userId], (err, result) => {
        callback(err, result);
    });
};


// Remove one item - same ownership check as above
const deleteCartItem = (id, userId, callback) => {

    const sql = `
        DELETE cart_items
        FROM cart_items
        INNER JOIN carts ON cart_items.cart_id = carts.id
        WHERE cart_items.id = ? AND carts.user_id = ?
    `;

    db.query(sql, [id, userId], (err, result) => {
        callback(err, result);
    });
};


const clearCart = (cartId, callback) => {
    const sql = `
        DELETE FROM cart_items
        WHERE cart_id = ?
    `;

    db.query(sql, [cartId], (err, result) => {
        callback(err, result);
    });
};

module.exports = {
    getCartByUserId,
    createCart,
    ensureCart,
    addCartItem,
    getCartItems,
    updateCartItem,
    deleteCartItem,
    clearCart
};