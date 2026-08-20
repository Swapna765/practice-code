const Product = require("../models/Product");

// ==========================================
// GET ALL PRODUCTS
// ==========================================
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// GET SINGLE PRODUCT
// ==========================================
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category", "name");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Get product error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// CREATE PRODUCT
// ==========================================
const createProduct = async (req, res) => {
    try {
        const {
            name,
            productCode,
            barcode,
            category,
            purchasePrice,
            sellingPrice,
            taxRate,
            stock,
            minimumStock,
            unit
        } = req.body;

        if (
            !name ||
            !productCode ||
            !category ||
            purchasePrice === undefined ||
            sellingPrice === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Required product fields are missing"
            });
        }

        const existingProduct = await Product.findOne({
            productCode
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product code already exists"
            });
        }

        if (barcode) {
            const existingBarcode = await Product.findOne({
                barcode
            });

            if (existingBarcode) {
                return res.status(400).json({
                    success: false,
                    message: "Barcode already exists"
                });
            }
        }

        const product = await Product.create({
            name,
            productCode,
            barcode,
            category,
            purchasePrice,
            sellingPrice,
            taxRate: taxRate || 0,
            stock: stock || 0,
            minimumStock: minimumStock || 5,
            unit: unit || "piece"
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Create product error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("Update product error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// SEARCH PRODUCT BY BARCODE
// ==========================================
const getProductByBarcode = async (req, res) => {
    try {
        const product = await Product.findOne({
            barcode: req.params.barcode,
            isActive: true
        }).populate("category", "name");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Barcode search error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByBarcode
};