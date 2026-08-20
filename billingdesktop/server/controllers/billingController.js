const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const Customer = require("../models/Customer");


// ==========================================
// GENERATE INVOICE NUMBER
// ==========================================

const generateInvoiceNumber = async () => {

    const count = await Invoice.countDocuments();

    const number = count + 1;

    return `INV-${String(number).padStart(5, "0")}`;
};


// ==========================================
// CREATE INVOICE
// ==========================================

const createInvoice = async (req, res) => {

    try {

        const {
            customer,
            items,
            discount = 0,
            paymentMethod = "cash",
            paymentStatus = "paid",
            amountPaid = 0,
            notes
        } = req.body;


        // ----------------------------------
        // VALIDATION
        // ----------------------------------

        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "At least one product is required"
            });
        }


        // ----------------------------------
        // CHECK CUSTOMER
        // ----------------------------------

        if (customer) {

            const customerExists =
                await Customer.findById(customer);

            if (!customerExists) {

                return res.status(404).json({
                    success: false,
                    message: "Customer not found"
                });
            }
        }


        const invoiceItems = [];

        let subtotal = 0;
        let taxAmount = 0;


        // ----------------------------------
        // PROCESS PRODUCTS
        // ----------------------------------

        for (const item of items) {

            if (
                !item.product ||
                !item.quantity
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Product and quantity are required"
                });
            }


            const quantity =
                Number(item.quantity);


            if (quantity <= 0) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Quantity must be greater than 0"
                });
            }


            // Find product
            const product =
                await Product.findById(item.product);


            if (!product) {

                return res.status(404).json({
                    success: false,
                    message:
                        `Product not found: ${item.product}`
                });
            }


            // --------------------------------
            // CHECK STOCK
            // --------------------------------

            if (product.stock < quantity) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Insufficient stock for ${product.name}. Available: ${product.stock}`
                });
            }


            const price =
                Number(
                    item.price !== undefined
                        ? item.price
                        : product.sellingPrice
                );


            const taxRate =
                Number(
                    item.taxRate !== undefined
                        ? item.taxRate
                        : product.taxRate || 0
                );


            const itemSubtotal =
                quantity * price;


            const itemTax =
                itemSubtotal *
                taxRate /
                100;


            const itemTotal =
                itemSubtotal + itemTax;


            subtotal += itemSubtotal;
            taxAmount += itemTax;


            invoiceItems.push({

                product: product._id,

                name: product.name,

                quantity,

                price,

                taxRate,

                taxAmount: itemTax,

                total: itemTotal

            });


            // --------------------------------
            // REDUCE STOCK
            // --------------------------------

            product.stock -= quantity;

            await product.save();
        }


        // ----------------------------------
        // DISCOUNT
        // ----------------------------------

        const discountAmount =
            Number(discount || 0);


        if (discountAmount < 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid discount"
            });
        }


        // ----------------------------------
        // GRAND TOTAL
        // ----------------------------------

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


        // ----------------------------------
        // PAYMENT
        // ----------------------------------

        const paid =
            Number(amountPaid || 0);


        if (paid < 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Amount paid cannot be negative"
            });
        }


        let changeAmount = 0;

        if (paid > grandTotal) {
            changeAmount = paid - grandTotal;
        }


        // ----------------------------------
        // INVOICE NUMBER
        // ----------------------------------

        const invoiceNumber =
            await generateInvoiceNumber();


        // ----------------------------------
        // CREATE INVOICE
        // ----------------------------------

        const invoice =
            await Invoice.create({

                invoiceNumber,

                customer:
                    customer || null,

                items: invoiceItems,

                subtotal,

                taxAmount,

                discount: discountAmount,

                grandTotal,

                paymentMethod,

                paymentStatus,

                amountPaid: paid,

                changeAmount,

                soldBy: req.user._id,

                notes: notes || ""

            });


        // ----------------------------------
        // POPULATE DATA
        // ----------------------------------

        const populatedInvoice =
            await Invoice.findById(
                invoice._id
            )
            .populate(
                "customer",
                "name phone email"
            )
            .populate(
                "soldBy",
                "name email role"
            );


        res.status(201).json({

            success: true,

            message:
                "Invoice created successfully",

            invoice:
                populatedInvoice

        });


    } catch (error) {

        console.error(
            "Create invoice error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// GET ALL INVOICES
// ==========================================

const getInvoices = async (req, res) => {

    try {

        const invoices =
            await Invoice.find()
                .populate(
                    "customer",
                    "name phone"
                )
                .populate(
                    "soldBy",
                    "name role"
                )
                .sort({
                    invoiceDate: -1
                });


        res.json({

            success: true,

            count: invoices.length,

            invoices

        });


    } catch (error) {

        console.error(
            "Get invoices error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// GET SINGLE INVOICE
// ==========================================

const getInvoiceById = async (req, res) => {

    try {

        const invoice =
            await Invoice.findById(
                req.params.id
            )
            .populate(
                "customer",
                "name phone email address"
            )
            .populate(
                "soldBy",
                "name email role"
            );


        if (!invoice) {

            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }


        res.json({

            success: true,

            invoice

        });


    } catch (error) {

        console.error(
            "Get invoice error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById
};