const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    getMyCart,
    createMyCart,
    addToCart,
    updateCartItem,
    deleteCartItem
} = require("../controllers/cartController");

const router = express.Router();

router.get("/cart", authMiddleware, getMyCart);

router.post("/cart", authMiddleware, createMyCart);

router.post("/cart/items", authMiddleware, addToCart);

router.put("/cart/items/:id", authMiddleware, updateCartItem);

router.delete(
    "/cart/items/:id",
    authMiddleware,
    deleteCartItem
);
module.exports = router;