const mysql = require("mysql2");

require("dotenv").config();

// A connection POOL instead of a single connection.
// A single createConnection() connection is closed by MySQL after it sits idle
// (wait_timeout) and every later query then fails with
// "Can't add new command when connection is in closed state".
// The pool re-opens connections automatically and keeps the same db.query() API.
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("Database connection failed:", err);
        return;
    }

    console.log("MySQL connected successfully");
    connection.release();
});

module.exports = db;