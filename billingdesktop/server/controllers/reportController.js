const Invoice = require("../models/Invoice");
const Purchase = require("../models/Purchase");
const Return = require("../models/Return");


// ==========================================
// SALES REPORT
// ==========================================

const getSalesReport = async (req, res) => {
    try {

        const { startDate, endDate } = req.query;

        const filter = {};

        if (startDate || endDate) {
            filter.invoiceDate = {};

            if (startDate) {
                filter.invoiceDate.$gte =
                    new Date(startDate);
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setDate(end.getDate() + 1);

                filter.invoiceDate.$lt = end;
            }
        }


        const invoices =
            await Invoice.find(filter)
                .populate(
                    "customer",
                    "name phone"
                )
                .sort({
                    invoiceDate: -1
                });


        const totalSales =
            invoices.reduce(
                (sum, invoice) =>
                    sum +
                    Number(invoice.grandTotal || 0),
                0
            );


        res.json({
            success: true,

            count: invoices.length,

            totalSales,

            invoices
        });

    } catch (error) {

        console.error(
            "Sales report error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ==========================================
// PURCHASE REPORT
// ==========================================

const getPurchaseReport = async (req, res) => {
    try {

        const { startDate, endDate } = req.query;

        const filter = {};

        if (startDate || endDate) {

            filter.purchaseDate = {};

            if (startDate) {
                filter.purchaseDate.$gte =
                    new Date(startDate);
            }

            if (endDate) {

                const end = new Date(endDate);

                end.setDate(
                    end.getDate() + 1
                );

                filter.purchaseDate.$lt = end;
            }
        }


        const purchases =
            await Purchase.find(filter)
                .populate(
                    "supplier",
                    "name companyName phone"
                )
                .sort({
                    purchaseDate: -1
                });


        const totalPurchases =
            purchases.reduce(
                (sum, purchase) =>
                    sum +
                    Number(
                        purchase.grandTotal || 0
                    ),
                0
            );


        res.json({

            success: true,

            count:
                purchases.length,

            totalPurchases,

            purchases

        });

    } catch (error) {

        console.error(
            "Purchase report error:",
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
// RETURN REPORT
// ==========================================

const getReturnReport = async (req, res) => {
    try {

        const { startDate, endDate } = req.query;

        const filter = {};

        if (startDate || endDate) {

            filter.returnDate = {};

            if (startDate) {
                filter.returnDate.$gte =
                    new Date(startDate);
            }

            if (endDate) {

                const end = new Date(endDate);

                end.setDate(
                    end.getDate() + 1
                );

                filter.returnDate.$lt = end;
            }
        }


        const returns =
            await Return.find(filter)
                .populate(
                    "invoice",
                    "invoiceNumber"
                )
                .populate(
                    "customer",
                    "name phone"
                )
                .populate(
                    "processedBy",
                    "name"
                )
                .sort({
                    returnDate: -1
                });


        const totalRefund =
            returns.reduce(
                (sum, returnData) =>
                    sum +
                    Number(
                        returnData.totalRefund || 0
                    ),
                0
            );


        res.json({

            success: true,

            count:
                returns.length,

            totalRefund,

            returns

        });

    } catch (error) {

        console.error(
            "Return report error:",
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
// PROFIT REPORT
// ==========================================

const getProfitReport = async (req, res) => {
    try {

        const { startDate, endDate } = req.query;

        const filter = {};

        if (startDate || endDate) {

            filter.invoiceDate = {};

            if (startDate) {

                filter.invoiceDate.$gte =
                    new Date(startDate);
            }

            if (endDate) {

                const end = new Date(endDate);

                end.setDate(
                    end.getDate() + 1
                );

                filter.invoiceDate.$lt = end;
            }
        }


        const invoices =
            await Invoice.find(filter)
                .populate(
                    "items.product",
                    "purchasePrice"
                );


        let totalSales = 0;
        let totalCost = 0;


        for (
            const invoice
            of invoices
        ) {

            totalSales +=
                Number(
                    invoice.grandTotal || 0
                );


            for (
                const item
                of invoice.items
            ) {

                const purchasePrice =
                    item.product
                        ? Number(
                            item.product.purchasePrice || 0
                        )
                        : 0;


                const quantity =
                    Number(
                        item.quantity || 0
                    );


                totalCost +=
                    purchasePrice *
                    quantity;
            }
        }


        const grossProfit =
            totalSales -
            totalCost;


        res.json({

            success: true,

            report: {

                totalSales,

                totalCost,

                grossProfit,

                profitMargin:
                    totalSales > 0
                        ? (
                            grossProfit /
                            totalSales
                        ) * 100
                        : 0

            }

        });

    } catch (error) {

        console.error(
            "Profit report error:",
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

    getSalesReport,

    getPurchaseReport,

    getReturnReport,

    getProfitReport

};