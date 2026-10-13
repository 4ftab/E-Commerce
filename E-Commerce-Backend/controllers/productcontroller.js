const db = require("../config/db");
const productModel = require("../models/productModel");
const getProducts = (req, res) => {

    productModel.getAllProducts((err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to retrieve products"
            });
        }

        res.json(results);
    });
};
const getProductById = (req, res) => {

    const id = req.params.id;

    productModel.getProductById(id, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to retrieve product"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(results[0]);
    });
};

const createProduct = (req, res) => {

    const { name, price, categoryId, image } = req.body;

    productModel.createProduct(
        name,
        price,
        categoryId,
        image,
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to add product"
                });
            }

            res.status(201).json({
                message: "Product added successfully",
                productId: result.insertId
            });
        }
    );
};

const updateProduct = (req, res) => {

    const id = req.params.id;

    const { name, price, categoryId, image } = req.body;

    productModel.updateProduct(
        id,
        name,
        price,
        categoryId,
        image,
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to update product"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.json({
                message: "Product updated successfully"
            });
        }
    );
};

const deleteProduct = (req, res) => {

    const id = req.params.id;

    productModel.deleteProduct(id, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to delete product"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    });
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};