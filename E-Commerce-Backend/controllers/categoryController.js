const categoryModel = require("../models/categoryModel");


const getCategories = (req, res) => {

    categoryModel.getAllCategories((err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to retrieve categories"
            });
        }

        res.json(results);
    });
};


const getCategoryById = (req, res) => {

    const id = req.params.id;

    categoryModel.getCategoryById(id, (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to retrieve category"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json(results[0]);
    });
};


const createCategory = (req, res) => {

    const { name } = req.body;

    categoryModel.createCategory(name, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to create category"
            });
        }

        res.status(201).json({
            message: "Category created successfully",
            categoryId: result.insertId
        });
    });
};


const updateCategory = (req, res) => {

    const id = req.params.id;
    const { name } = req.body;

    categoryModel.updateCategory(id, name, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to update category"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json({
            message: "Category updated successfully"
        });
    });
};


const deleteCategory = (req, res) => {

    const id = req.params.id;

    categoryModel.deleteCategory(id, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to delete category"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json({
            message: "Category deleted successfully"
        });
    });
};


module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};