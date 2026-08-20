const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Supplier = require("../models/Supplier");
const Purchase = require("../models/Purchase");
const Return = require("../models/Return");


// ==========================================
// GET DASHBOARD
// ==========================================

const getDashboard = async (req, res) => {

    try {

        // ----------------------------------
        // TODAY START / END
        // ----------------------------------

        const today = new Date();

        const startOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const endOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
        );


        // ----------------------------------
        // TOTAL COUNTS
        // ----------------------------------

        const totalProducts =
            await Product.countDocuments();

        const totalCustomers =
            await Customer.countDocuments();

        const totalSuppliers =
            await Supplier.countDocuments();


        // ----------------------------------
        // TODAY'S INVOICES
        // ----------------------------------

        const todayInvoices =
            await Invoice.find({
                invoiceDate: {
                    $gte: startOfToday,
                    $lt: endOfToday
                }
            });


        // ----------------------------------
        // TODAY'S SALES
        // ----------------------------------

        const todaySales =
            todayInvoices.reduce(
                (total, invoice) =>
                    total + Number(
                        invoice.grandTotal || 0
                    ),
                0
            );


        const todayInvoiceCount =
            todayInvoices.length;


        // ----------------------------------
        // TOTAL SALES
        // ----------------------------------

        const allInvoices =
            await Invoice.find();


        const totalSales =
            allInvoices.reduce(
                (total, invoice) =>
                    total + Number(
                        invoice.grandTotal || 0
                    ),
                0
            );


        const totalInvoices =
            allInvoices.length;


        // ----------------------------------
        // TOTAL PURCHASES
        // ----------------------------------

        const allPurchases =
            await Purchase.find();


        const totalPurchases =
            allPurchases.reduce(
                (total, purchase) =>
                    total + Number(
                        purchase.grandTotal || 0
                    ),
                0
            );


        // ----------------------------------
        // TOTAL RETURNS
        // ----------------------------------

        const allReturns =
            await Return.find();


        const totalReturns =
            allReturns.reduce(
                (total, returnData) =>
                    total + Number(
                        returnData.totalRefund || 0
                    ),
                0
            );


        // ----------------------------------
        // LOW STOCK PRODUCTS
        // ----------------------------------

        const lowStockProducts =
            await Product.find({
                $expr: {
                    $lte: [
                        "$stock",
                        "$minimumStock"
                    ]
                }
            })
            .select(
                "name productCode stock minimumStock unit"
            )
            .sort({
                stock: 1
            });


        // ----------------------------------
        // RECENT INVOICES
        // ----------------------------------

        const recentInvoices =
            await Invoice.find()
                .populate(
                    "customer",
                    "name phone"
                )
                .sort({
                    invoiceDate: -1
                })
                .limit(5)
                .select(
                    "invoiceNumber customer grandTotal paymentMethod invoiceDate"
                );


        // ----------------------------------
        // LAST 7 DAYS SALES
        // ----------------------------------

        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 6
        );

        sevenDaysAgo.setHours(
            0,
            0,
            0,
            0
        );


        const last7DaysInvoices =
            await Invoice.find({
                invoiceDate: {
                    $gte: sevenDaysAgo,
                    $lt: endOfToday
                }
            });


        const dailySales = [];


        for (let i = 0; i < 7; i++) {

            const date = new Date(
                sevenDaysAgo
            );

            date.setDate(
                sevenDaysAgo.getDate() + i
            );


            const nextDate = new Date(
                date
            );

            nextDate.setDate(
                date.getDate() + 1
            );


            const sales =
                last7DaysInvoices
                    .filter(invoice =>
                        invoice.invoiceDate >= date &&
                        invoice.invoiceDate < nextDate
                    )
                    .reduce(
                        (total, invoice) =>
                            total +
                            Number(
                                invoice.grandTotal || 0
                            ),
                        0
                    );


            dailySales.push({

                date:
                    date
                        .toISOString()
                        .split("T")[0],

                sales

            });
        }


        // ----------------------------------
        // TOP SELLING PRODUCTS
        // ----------------------------------

        const topProducts =
            await Invoice.aggregate([

                {
                    $unwind: "$items"
                },

                {
                    $group: {

                        _id:
                            "$items.product",

                        totalQuantity: {
                            $sum:
                                "$items.quantity"
                        },

                        totalSales: {
                            $sum:
                                "$items.total"
                        }

                    }
                },

                {
                    $sort: {
                        totalQuantity: -1
                    }
                },

                {
                    $limit: 5
                }

            ]);


        // Get product information
        const topSellingProducts = [];


        for (
            const item
            of topProducts
        ) {

            const product =
                await Product.findById(
                    item._id
                )
                .select(
                    "name productCode sellingPrice"
                );


            if (product) {

                topSellingProducts.push({

                    product,

                    totalQuantity:
                        item.totalQuantity,

                    totalSales:
                        item.totalSales

                });
            }
        }


        // ----------------------------------
        // ESTIMATED PROFIT
        // ----------------------------------

        let estimatedProfit = 0;


        for (
            const invoice
            of allInvoices
        ) {

            for (
                const item
                of invoice.items
            ) {

                const product =
                    await Product.findById(
                        item.product
                    );


                if (product) {

                    const cost =
                        Number(
                            product.purchasePrice || 0
                        );

                    const sellingPrice =
                        Number(
                            item.price || 0
                        );

                    estimatedProfit +=
                        (
                            sellingPrice -
                            cost
                        ) *
                        Number(
                            item.quantity || 0
                        );
                }
            }
        }


        // ----------------------------------
        // DASHBOARD RESPONSE
        // ----------------------------------

        res.json({

            success: true,

            dashboard: {

                today: {

                    sales:
                        todaySales,

                    invoices:
                        todayInvoiceCount

                },


                totals: {

                    products:
                        totalProducts,

                    customers:
                        totalCustomers,

                    suppliers:
                        totalSuppliers,

                    invoices:
                        totalInvoices,

                    sales:
                        totalSales,

                    purchases:
                        totalPurchases,

                    returns:
                        totalReturns,

                    estimatedProfit

                },


                lowStockProducts,

                recentInvoices,

                dailySales,

                topSellingProducts

            }

        });


    } catch (error) {

        console.error(
            "Dashboard error:",
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
// EXPORT
// ==========================================

module.exports = {
    getDashboard
};