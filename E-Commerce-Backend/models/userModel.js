const db = require("../config/db");

const createUser = (name, email, password, callback) => {

    const sql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, email, password], (err, result) => {
        callback(err, result);
    });
};
const findUserByEmail = (email, callback) => {

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, results) => {
        callback(err, results);
    });
};
const getUserById = (id, callback) => {

    const sql = `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        callback(err, results);
    });
};
const updateUser = (id, name, email, callback) => {
    const sql = `
        UPDATE users
        SET name = ?, email = ?
        WHERE id = ?
    `;

    db.query(sql, [name, email, id], (err, result) => {
        callback(err, result);
    });
};

module.exports = {
    createUser,
    findUserByEmail,
    getUserById,
    updateUser
};