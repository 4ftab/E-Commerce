const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");


// Get user's cart
const getMyCart = (req, res) => {

    const userId = req.user.userId;

    cartModel.getCartByUserId(userId, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to retrieve cart"
            });
        }

        // If user doesn't have a cart
        if (results.length === 0) {

            return res.json({
                message: "Cart is empty",
                cart: null
            });
        }

        const cart = results[0];

        cartModel.getCartItems(cart.id, (err, items) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to retrieve cart items"
                });
            }

            res.json({
                message: "Cart retrieved successfully",
                cart: {
                    id: cart.id,
                    user_id: cart.user_id,
                    created_at: cart.created_at,
                    items: items
                }
            });
        });
    });
};


// Create cart for logged-in user
const createMyCart = (req, res) => {

    const userId = req.user.userId;

    cartModel.getCartByUserId(userId, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        // Don't create another cart
        if (results.length > 0) {

            return res.status(400).json({
                message: "Cart already exists"
            });
        }

        cartModel.createCart(userId, (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to create cart"
                });
            }

            res.status(201).json({
                message: "Cart created successfully",
                cartId: result.insertId
            });
        });
    });
};


// Add product to cart
// FIX: creates the cart automatically, validates input, checks the product
// exists and merges duplicates (see cartModel.addCartItem).
const addToCart = (req, res) => {

    const userId = req.user.userId;

    const body = req.body || {};

    const productId = parseInt(body.productId, 10);

    let quantity = parseInt(body.quantity, 10);

    if (!quantity || quantity < 1) {
        quantity = 1;
    }

    if (!productId) {
        return res.status(400).json({
            message: "productId is required"
        });
    }

    // Make sure the product exists (and is in stock)
    productModel.getProductById(productId, (err, products) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (products.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (products[0].stock === 0) {
            return res.status(400).json({
                message: "This product is out of stock"
            });
        }

        // Find the user's cart, or create it
        cartModel.ensureCart(userId, (err, cartId) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to get or create cart"
                });
            }

            cartModel.addCartItem(
                cartId,
                productId,
                quantity,
                (err, result) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            message: "Failed to add product to cart"
                        });
                    }

                    res.status(201).json({
                        message: "Product added to cart successfully",
                        cartItemId: result.insertId
                    });
                }
            );
        });
    });
};

// Change quantity of one cart item (used by the + / - buttons)
const updateCartItem = (req, res) => {

    const userId = req.user.userId;

    const itemId = req.params.id;

    const quantity = parseInt((req.body || {}).quantity, 10);

    if (!quantity || quantity < 1) {
        return res.status(400).json({
            message: "Quantity must be at least 1"
        });
    }

    cartModel.updateCartItem(
        itemId,
        userId,
        quantity,
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to update cart item"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Cart item not found"
                });
            }

            res.json({
                message: "Cart quantity updated successfully"
            });
        }
    );
};

const deleteCartItem = (req, res) => {

    const userId = req.user.userId;

    const itemId = req.params.id;

    cartModel.deleteCartItem(
        itemId,
        userId,
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to remove cart item"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Cart item not found"
                });
            }

            res.json({
                message: "Product removed from cart successfully"
            });
        }
    );
};

module.exports = {
    getMyCart,
    createMyCart,
    addToCart,
    updateCartItem,
    deleteCartItem
};