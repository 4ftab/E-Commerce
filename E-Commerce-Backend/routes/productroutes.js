const { getProducts,getProductById,createProduct, updateProduct,deleteProduct } = require("../controllers/productcontroller");
const express = require("express");
const db = require("../config/db");

const router = express.Router();

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

router.post("/products", createProduct);

router.put("/products/:id", updateProduct);

router.delete("/products/:id",deleteProduct);

module.exports = router;