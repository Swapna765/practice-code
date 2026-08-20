const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");


// ==========================================
// CREATE PURCHASE
// ==========================================

const createPurchase = async (req, res) => {
    try {

        const {
            supplier,
            invoiceNumber,
            items,
            discount = 0,
            paymentStatus = "paid",
            notes
        } = req.body;


        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (
            !supplier ||
            !invoiceNumber ||
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Supplier, invoice number and items are required"
            });
        }


        // -------------------------------
        // CHECK SUPPLIER
        // -------------------------------

        const supplierExists =
            await Supplier.findById(supplier);

        if (!supplierExists) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }


        if (!supplierExists.isActive) {
            return res.status(400).json({
                success: false,
                message: "Supplier is inactive"
            });
        }


        // -------------------------------
        // PROCESS ITEMS
        // -------------------------------

        const purchaseItems = [];

        let subtotal = 0;
        let taxAmount = 0;


        for (const item of items) {

            if (
                !item.product ||
                !item.quantity ||
                item.purchasePrice === undefined
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Each item requires product, quantity and purchasePrice"
                });
            }


            const quantity =
                Number(item.quantity);

            const purchasePrice =
                Number(item.purchasePrice);

            const taxRate =
                Number(item.taxRate || 0);


            if (
                quantity <= 0 ||
                purchasePrice < 0 ||
                taxRate < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid purchase item values"
                });
            }


            const product =
                await Product.findById(item.product);


            if (!product) {
                return res.status(404).json({
                    success: false,
                    message:
                        `Product not found: ${item.product}`
                });
            }


            const itemSubtotal =
                quantity * purchasePrice;

            const itemTax =
                itemSubtotal *
                taxRate /
                100;

            const itemTotal =
                itemSubtotal + itemTax;


            subtotal += itemSubtotal;
            taxAmount += itemTax;


            purchaseItems.push({
                product: product._id,
                quantity,
                purchasePrice,
                taxRate,
                total: itemTotal
            });


            // --------------------------------
            // INCREASE STOCK
            // --------------------------------

            product.stock =
                Number(product.stock || 0) +
                quantity;

            // Update purchase price
            product.purchasePrice =
                purchasePrice;

            await product.save();
        }


        // -------------------------------
        // CALCULATE TOTAL
        // -------------------------------

        const discountAmount =
            Number(discount || 0);


        const grandTotal =
            subtotal +
            taxAmount -
            discountAmount;


        if (grandTotal < 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Discount cannot be greater than total"
            });
        }


        // -------------------------------
        // CREATE PURCHASE
        // -------------------------------

        const purchase =
            await Purchase.create({
                supplier,
                invoiceNumber,
                items: purchaseItems,
                subtotal,
                taxAmount,
                discount: discountAmount,
                grandTotal,
                paymentStatus,
                notes: notes || ""
            });


        const populatedPurchase =
            await Purchase.findById(
                purchase._id
            )
            .populate("supplier", "name companyName phone")
            .populate("items.product", "name productCode");


        res.status(201).json({
            success: true,
            message:
                "Purchase created successfully",
            purchase: populatedPurchase
        });


    } catch (error) {

        console.error(
            "Create purchase error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// GET ALL PURCHASES
// ==========================================

const getPurchases = async (req, res) => {
    try {

        const purchases =
            await Purchase.find()
                .populate(
                    "supplier",
                    "name companyName phone"
                )
                .populate(
                    "items.product",
                    "name productCode"
                )
                .sort({
                    purchaseDate: -1
                });


        res.json({
            success: true,
            count: purchases.length,
            purchases
        });


    } catch (error) {

        console.error(
            "Get purchases error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// GET SINGLE PURCHASE
// ==========================================

const getPurchaseById = async (req, res) => {
    try {

        const purchase =
            await Purchase.findById(
                req.params.id
            )
            .populate(
                "supplier",
                "name companyName phone"
            )
            .populate(
                "items.product",
                "name productCode"
            );


        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });
        }


        res.json({
            success: true,
            purchase
        });


    } catch (error) {

        console.error(
            "Get purchase error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createPurchase,
    getPurchases,
    getPurchaseById
};