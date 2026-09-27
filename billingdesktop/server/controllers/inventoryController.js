const Product = require("../models/Product");


// ==========================================
// GET ALL INVENTORY
// ==========================================

const getInventory = async (req, res) => {
    try {

        const products = await Product.find()
            .populate("category", "name")
            .sort({ name: 1 });

        res.json({
            success: true,
            count: products.length,
            inventory: products
        });

    } catch (error) {

        console.error(
            "Get inventory error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// STOCK IN
// ==========================================

const stockIn = async (req, res) => {
    try {

        const {
            productId,
            quantity
        } = req.body;


        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message:
                    "Product ID and quantity are required"
            });
        }


        if (Number(quantity) <= 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be greater than 0"
            });
        }


        const product =
            await Product.findById(productId);


        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        product.stock += Number(quantity);

        await product.save();


        res.json({
            success: true,
            message: "Stock added successfully",
            product: {
                id: product._id,
                name: product.name,
                stock: product.stock
            }
        });

    } catch (error) {

        console.error(
            "Stock in error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// STOCK OUT
// ==========================================

const stockOut = async (req, res) => {
    try {

        const {
            productId,
            quantity
        } = req.body;


        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message:
                    "Product ID and quantity are required"
            });
        }


        const requestedQuantity =
            Number(quantity);


        if (requestedQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be greater than 0"
            });
        }


        const product =
            await Product.findById(productId);


        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        if (
            product.stock <
            requestedQuantity
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Insufficient stock. Available stock: ${product.stock}`
            });
        }


        product.stock -= requestedQuantity;

        await product.save();


        res.json({
            success: true,
            message: "Stock removed successfully",
            product: {
                id: product._id,
                name: product.name,
                stock: product.stock
            }
        });

    } catch (error) {

        console.error(
            "Stock out error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// STOCK ADJUSTMENT
// ==========================================

const adjustStock = async (req, res) => {
    try {

        const {
            productId,
            stock,
            reason
        } = req.body;


        if (
            !productId ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Product ID and stock are required"
            });
        }


        const newStock =
            Number(stock);


        if (newStock < 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Stock cannot be negative"
            });
        }


        const product =
            await Product.findById(productId);


        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        product.stock = newStock;

        await product.save();


        res.json({
            success: true,
            message: "Stock adjusted successfully",
            reason: reason || "",
            product: {
                id: product._id,
                name: product.name,
                stock: product.stock
            }
        });

    } catch (error) {

        console.error(
            "Stock adjustment error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// LOW STOCK PRODUCTS
// ==========================================

const getLowStock = async (req, res) => {
    try {

        const products = await Product.find({
            $expr: {
                $lte: [
                    "$stock",
                    "$minimumStock"
                ]
            }
        })
        .populate("category", "name")
        .sort({ stock: 1 });


        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        console.error(
            "Low stock error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getInventory,
    stockIn,
    stockOut,
    adjustStock,
    getLowStock
};