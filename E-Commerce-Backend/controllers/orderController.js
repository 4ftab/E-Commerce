const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");

const createOrder = (req, res) => {
    const userId = req.user.userId;

    // First, find the user's cart
    cartModel.getCartByUserId(userId, (err, carts) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (carts.length === 0) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const cartId = carts[0].id;

        // Get all products inside the cart
        cartModel.getCartItems(cartId, (err, items) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Failed to retrieve cart items"
                });
            }

            if (items.length === 0) {
                return res.status(400).json({
                    message: "Cart is empty"
                });
            }

            // Calculate total amount
            let totalAmount = 0;

            items.forEach((item) => {
                totalAmount += item.price * item.quantity;
            });

            // Create the main order
            orderModel.createOrder(
                userId,
                totalAmount,
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Failed to create order"
                        });
                    }

                    const orderId = result.insertId;

                    // Add every cart item to order_items
                    let completedItems = 0;

                    items.forEach((item) => {
                        orderModel.createOrderItem(
                            orderId,
                            item.product_id,
                            item.quantity,
                            item.price,
                            (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                        message: "Failed to create order item"
                                    });
                                }

                                completedItems++;

                                if (completedItems === items.length) {
    cartModel.clearCart(cartId, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Order created but failed to clear cart"
            });
        }

        res.status(201).json({
            message: "Order created successfully",
            orderId: orderId,
            totalAmount: totalAmount
        });
    });
}
                            }
                        );
                    });
                }
            );
        });
    });
};

const getMyOrders = (req, res) => {
    const userId = req.user.userId;

    orderModel.getOrdersByUserId(
        userId,
        (err, orders) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to retrieve orders"
                });
            }

            if (orders.length === 0) {
                return res.json({
                    message: "No orders found",
                    orders: []
                });
            }

            let completedOrders = 0;

            const ordersWithItems = [];

            orders.forEach((order) => {

                orderModel.getOrderItems(
                    order.id,
                    (err, items) => {

                        if (err) {
                            console.log(err);

                            return res.status(500).json({
                                message: "Failed to retrieve order items"
                            });
                        }

                        ordersWithItems.push({
                            id: order.id,
                            user_id: order.user_id,
                            total_amount: order.total_amount,
                            status: order.status,
                            created_at: order.created_at,
                            items: items
                        });

                        completedOrders++;

                        if (completedOrders === orders.length) {

                            res.json({
                                message: "Orders retrieved successfully",
                                orders: ordersWithItems
                            });

                        }
                    }
                );
            });
        }
    );
};

const getOrderById = (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.userId;

    orderModel.getOrderById(
        orderId,
        userId,
        (err, orders) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to retrieve order"
                });
            }

            if (orders.length === 0) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            const order = orders[0];

            orderModel.getOrderItems(
                order.id,
                (err, items) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            message: "Failed to retrieve order items"
                        });
                    }

                    res.json({
                        message: "Order retrieved successfully",
                        order: {
                            id: order.id,
                            user_id: order.user_id,
                            total_amount: order.total_amount,
                            status: order.status,
                            created_at: order.created_at,
                            items: items
                        }
                    });
                }
            );
        }
    );
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
};