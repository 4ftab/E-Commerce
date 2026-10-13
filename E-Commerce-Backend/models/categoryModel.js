const db = require("../config/db");

const getAllCategories = (callback) => {
    const sql = "SELECT * FROM categories";

    db.query(sql, (err, results) => {
        callback(err, results);
    });
};


const getCategoryById = (id, callback) => {
    const sql = "SELECT * FROM categories WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        callback(err, results);
    });
};


const createCategory = (name, callback) => {
    const sql = "INSERT INTO categories (name) VALUES (?)";

    db.query(sql, [name], (err, result) => {
        callback(err, result);
    });
};


const updateCategory = (id, name, callback) => {
    const sql = `
        UPDATE categories
        SET name = ?
        WHERE id = ?
    `;

    db.query(sql, [name, id], (err, result) => {
        callback(err, result);
    });
};


const deleteCategory = (id, callback) => {
    const sql = "DELETE FROM categories WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        callback(err, result);
    });
};


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};