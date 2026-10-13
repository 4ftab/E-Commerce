const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    createOrder,
    getMyOrders,
    getOrderById
} = require("../controllers/orderController");

const router = express.Router();

router.post("/orders", authMiddleware, createOrder);

router.get("/orders", authMiddleware, getMyOrders);

router.get(
    "/orders/:id",
    authMiddleware,
    getOrderById
);
module.exports = router;