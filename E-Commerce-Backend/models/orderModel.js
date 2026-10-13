const db = require("../config/db");

const createOrder = (userId, totalAmount, callback) => {
    const sql = `
        INSERT INTO orders (user_id, total_amount)
        VALUES (?, ?)
    `;

    db.query(sql, [userId, totalAmount], (err, result) => {
        callback(err, result);
    });
};

const createOrderItem = (
    orderId,
    productId,
    quantity,
    price,
    callback
) => {
    const sql = `
        INSERT INTO order_items
        (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [orderId, productId, quantity, price],
        (err, result) => {
            callback(err, result);
        }
    );
};

const getOrdersByUserId = (userId, callback) => {
    const sql = `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        callback(err, results);
    });
};

const getOrderItems = (orderId, callback) => {
    const sql = `
        SELECT
            order_items.id,
            order_items.product_id,
            products.name,
            order_items.quantity,
            order_items.price
        FROM order_items
        INNER JOIN products
            ON order_items.product_id = products.id
        WHERE order_items.order_id = ?
    `;

    db.query(sql, [orderId], (err, results) => {
        callback(err, results);
    });
};

const getOrderById = (orderId, userId, callback) => {
    const sql = `
        SELECT *
        FROM orders
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [orderId, userId],
        (err, results) => {
            callback(err, results);
        }
    );
};

module.exports = {
    createOrder,
    createOrderItem,
    getOrdersByUserId,
    getOrderItems,
    getOrderById
};