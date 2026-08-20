const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const Customer = require("../models/Customer");


// ==========================================
// CREATE INVOICE
// ==========================================
const createInvoice = async (req, res) => {
    try {

        const {
            customer,
            items,
            discount,
            paymentMethod,
            amountPaid,
            notes
        } = req.body;


        // ======================================
        // VALIDATE ITEMS
        // ======================================

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invoice must contain at least one product"
            });
        }


        // ======================================
        // FIND CUSTOMER
        // ======================================

        let customerData = null;

        if (customer) {

            customerData = await Customer.findById(
                customer
            );

            if (!customerData) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found"
                });
            }
        }


        // ======================================
        // PREPARE ITEMS
        // ======================================

        let subtotal = 0;
        let totalTax = 0;

        const processedItems = [];


        // ======================================
        // PROCESS EACH PRODUCT
        // ======================================

        for (const item of items) {

            const product = await Product.findById(
                item.product
            );


            if (!product) {
                return res.status(404).json({
                    success: false,
                    message:
                        `Product not found: ${item.product}`
                });
            }


            // Validate quantity
            if (
                !item.quantity ||
                item.quantity <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product quantity"
                });
            }


            const quantity = Number(
                item.quantity
            );


            // ==================================
            // CHECK INVENTORY
            // ==================================

            const inventory =
                await Inventory.findOne({
                    product: product._id
                });


            if (!inventory) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Inventory not found for ${product.name}`
                });
            }


            if (inventory.quantity < quantity) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Insufficient stock for ${product.name}`,
                    availableStock:
                        inventory.quantity
                });
            }


            // ==================================
            // CALCULATE ITEM TOTAL
            // ==================================

            const sellingPrice =
                Number(product.sellingPrice);


            const itemSubtotal =
                sellingPrice * quantity;


            const taxRate =
                Number(product.taxRate || 0);


            const itemTax =
                itemSubtotal *
                taxRate /
                100;


            const itemTotal =
                itemSubtotal + itemTax;


            subtotal += itemSubtotal;

            totalTax += itemTax;


            processedItems.push({
                product: product._id,

                productName:
                    product.name,

                productCode:
                    product.productCode,

                quantity,

                sellingPrice,

                taxRate,

                taxAmount:
                    Number(itemTax.toFixed(2)),

                total:
                    Number(itemTotal.toFixed(2))
            });
        }


        // ======================================
        // DISCOUNT
        // ======================================

        const discountAmount =
            Number(discount || 0);


        if (discountAmount > subtotal) {
            return res.status(400).json({
                success: false,
                message:
                    "Discount cannot be greater than subtotal"
            });
        }


        // ======================================
        // GRAND TOTAL
        // ======================================

        const grandTotal =
            subtotal -
            discountAmount +
            totalTax;


        // ======================================
        // PAYMENT
        // ======================================

        const paid =
            Number(amountPaid || 0);


        let paymentStatus = "paid";


        if (paid === 0) {
            paymentStatus = "pending";
        } else if (paid < grandTotal) {
            paymentStatus = "partial";
        }


        const changeAmount =
            paid > grandTotal
                ? paid - grandTotal
                : 0;


        // ======================================
        // GENERATE INVOICE NUMBER
        // ======================================

        const invoiceNumber =
            `INV-${Date.now()}`;


        // ======================================
        // CREATE INVOICE
        // ======================================

        const invoice =
            await Invoice.create({

                invoiceNumber,

                customer:
                    customerData
                        ? customerData._id
                        : null,

                customerName:
                    customerData
                        ? customerData.name
                        : "Walk-in Customer",

                customerPhone:
                    customerData
                        ? customerData.phone
                        : "",

                items:
                    processedItems,

                subtotal:
                    Number(subtotal.toFixed(2)),

                discount:
                    Number(discountAmount.toFixed(2)),

                tax:
                    Number(totalTax.toFixed(2)),

                grandTotal:
                    Number(grandTotal.toFixed(2)),

                paymentMethod:
                    paymentMethod || "cash",

                paymentStatus,

                amountPaid:
                    Number(paid.toFixed(2)),

                changeAmount:
                    Number(changeAmount.toFixed(2)),

                notes:
                    notes || ""
            });


        // ======================================
        // REDUCE INVENTORY
        // ======================================

        for (const item of processedItems) {

            const inventory =
                await Inventory.findOne({
                    product: item.product
                });


            inventory.quantity -=
                item.quantity;


            inventory.lastStockOut =
                item.quantity;


            await inventory.save();


            // Keep Product.stock synchronized

            const product =
                await Product.findById(
                    item.product
                );


            product.stock =
                inventory.quantity;


            await product.save();
        }


        // ======================================
        // UPDATE CUSTOMER
        // ======================================

        if (customerData) {

            customerData.totalPurchases += 1;

            customerData.totalSpent +=
                Number(grandTotal.toFixed(2));

            await customerData.save();
        }


        // ======================================
        // RESPONSE
        // ======================================

        const savedInvoice =
            await Invoice.findById(
                invoice._id
            )
                .populate(
                    "customer",
                    "name phone email"
                )
                .populate(
                    "items.product",
                    "name productCode barcode"
                );


        res.status(201).json({

            success: true,

            message:
                "Invoice created successfully",

            invoice:
                savedInvoice
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
                    "name phone email"
                )
                .sort({
                    createdAt: -1
                });


        res.json({

            success: true,

            count:
                invoices.length,

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
const getInvoice = async (req, res) => {

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
                    "items.product",
                    "name productCode barcode"
                );


        if (!invoice) {

            return res.status(404).json({

                success: false,

                message:
                    "Invoice not found"
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

            message:
                "Server error"
        });
    }
};


// ==========================================
// GET INVOICE BY INVOICE NUMBER
// ==========================================
const getInvoiceByNumber = async (req, res) => {

    try {

        const invoice =
            await Invoice.findOne({

                invoiceNumber:
                    req.params.invoiceNumber

            })
                .populate(
                    "customer",
                    "name phone email address"
                )
                .populate(
                    "items.product",
                    "name productCode barcode"
                );


        if (!invoice) {

            return res.status(404).json({

                success: false,

                message:
                    "Invoice not found"
            });
        }


        res.json({

            success: true,

            invoice
        });


    } catch (error) {

        console.error(
            "Find invoice error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"
        });
    }
};


module.exports = {
    createInvoice,
    getInvoices,
    getInvoice,
    getInvoiceByNumber
};