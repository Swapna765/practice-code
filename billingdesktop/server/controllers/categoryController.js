const Category = require("../models/Category");

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            name: name.trim()
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {
        console.error("Create category error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        console.error("Get categories error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET SINGLE CATEGORY
const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                isActive
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        console.error("Update category error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Delete category error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};