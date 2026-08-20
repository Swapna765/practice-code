const Return = require("../models/Return");
const Invoice = require("../models/Invoice");
const Product = require("../models/Product");

// ==========================================
// GENERATE RETURN NUMBER
// ==========================================

const generateReturnNumber = async () => {
    const count = await Return.countDocuments();

    return `RET-${String(count + 1).padStart(5, "0")}`;
};


// ==========================================
// CREATE RETURN
// ==========================================

const createReturn = async (req, res) => {
    try {

        const {
            invoiceId,
            items,
            reason,
            refundMethod = "cash"
        } = req.body;


        // ----------------------------------
        // VALIDATION
        // ----------------------------------

        if (
            !invoiceId ||
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invoice ID and return items are required"
            });
        }


        // ----------------------------------
        // FIND INVOICE
        // ----------------------------------

        const invoice =
            await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }


        const returnItems = [];

        let totalRefund = 0;


        // ----------------------------------
        // PROCESS RETURN ITEMS
        // ----------------------------------

        for (const returnItem of items) {

            if (
                !returnItem.product ||
                !returnItem.quantity
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Product and quantity are required"
                });
            }


            const quantity =
                Number(returnItem.quantity);


            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Return quantity must be a positive whole number"
                });
            }


            // ----------------------------------
            // FIND PRODUCT IN INVOICE
            // ----------------------------------

            const invoiceItem =
                invoice.items.find(
                    item =>
                        item.product.toString() ===
                        returnItem.product.toString()
                );


            if (!invoiceItem) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Product was not found in this invoice"
                });
            }


            // ----------------------------------
            // FIND PREVIOUS RETURNS
            // ----------------------------------

            const previousReturns =
                await Return.find({
                    invoice: invoice._id,
                    "items.product":
                        returnItem.product
                });


            let alreadyReturned = 0;


            for (
                const previousReturn
                of previousReturns
            ) {

                for (
                    const previousItem
                    of previousReturn.items
                ) {

                    if (
                        previousItem.product.toString() ===
                        returnItem.product.toString()
                    ) {
                        alreadyReturned +=
                            previousItem.quantity;
                    }
                }
            }


            // ----------------------------------
            // CALCULATE REMAINING QUANTITY
            // ----------------------------------

            const remainingQuantity =
                invoiceItem.quantity -
                alreadyReturned;


            // ----------------------------------
            // PREVENT EXCESSIVE RETURN
            // ----------------------------------

            if (remainingQuantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        `All purchased quantity of ${invoiceItem.name} has already been returned`
                });
            }


            if (
                quantity >
                remainingQuantity
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Cannot return ${quantity} units of ${invoiceItem.name}. Remaining returnable quantity: ${remainingQuantity}`
                });
            }


            // ----------------------------------
            // FIND PRODUCT
            // ----------------------------------

            const product =
                await Product.findById(
                    returnItem.product
                );


            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }


            // ----------------------------------
            // CALCULATE REFUND
            // ----------------------------------

            const refundAmount =
                quantity *
                invoiceItem.price;


            totalRefund += refundAmount;


            // ----------------------------------
            // ADD RETURN ITEM
            // ----------------------------------

            returnItems.push({
                product: product._id,
                quantity,
                price: invoiceItem.price,
                refundAmount
            });


            // ----------------------------------
            // RESTORE STOCK
            // ----------------------------------

            product.stock =
                Number(product.stock || 0) +
                quantity;

            await product.save();
        }


        // ----------------------------------
        // GENERATE RETURN NUMBER
        // ----------------------------------

        const returnNumber =
            await generateReturnNumber();


        // ----------------------------------
        // CREATE RETURN
        // ----------------------------------

        const newReturn =
            await Return.create({

                returnNumber,

                invoice:
                    invoice._id,

                customer:
                    invoice.customer || null,

                items:
                    returnItems,

                totalRefund,

                reason:
                    reason || "",

                refundMethod,

                processedBy:
                    req.user._id
            });


        // ----------------------------------
        // POPULATE RETURN
        // ----------------------------------

        const populatedReturn =
            await Return.findById(
                newReturn._id
            )
            .populate(
                "invoice",
                "invoiceNumber grandTotal"
            )
            .populate(
                "customer",
                "name phone"
            )
            .populate(
                "items.product",
                "name productCode"
            )
            .populate(
                "processedBy",
                "name role"
            );


        // ----------------------------------
        // RESPONSE
        // ----------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Return processed successfully",

            return:
                populatedReturn

        });


    } catch (error) {

        console.error(
            "Create return error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// GET ALL RETURNS
// ==========================================

const getReturns = async (req, res) => {

    try {

        const returns =
            await Return.find()
                .populate(
                    "invoice",
                    "invoiceNumber grandTotal"
                )
                .populate(
                    "customer",
                    "name phone"
                )
                .populate(
                    "items.product",
                    "name productCode"
                )
                .populate(
                    "processedBy",
                    "name role"
                )
                .sort({
                    returnDate: -1
                });


        return res.json({

            success: true,

            count:
                returns.length,

            returns

        });


    } catch (error) {

        console.error(
            "Get returns error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// GET SINGLE RETURN
// ==========================================

const getReturnById = async (req, res) => {

    try {

        const returnData =
            await Return.findById(
                req.params.id
            )
            .populate(
                "invoice",
                "invoiceNumber grandTotal"
            )
            .populate(
                "customer",
                "name phone"
            )
            .populate(
                "items.product",
                "name productCode"
            )
            .populate(
                "processedBy",
                "name role"
            );


        if (!returnData) {

            return res.status(404).json({

                success: false,

                message:
                    "Return not found"

            });
        }


        return res.json({

            success: true,

            return:
                returnData

        });


    } catch (error) {

        console.error(
            "Get return error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error"

        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    createReturn,
    getReturns,
    getReturnById
};