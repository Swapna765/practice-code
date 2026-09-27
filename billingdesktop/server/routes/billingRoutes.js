const express = require("express");

const {
    createInvoice,
    getInvoices,
    getInvoiceById
} = require("../controllers/billingController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// All billing routes require login
router.use(protect);


// Get all invoices
router.get(
    "/",
    getInvoices
);


// Get single invoice
router.get(
    "/:id",
    getInvoiceById
);


// Create invoice
// Admin + Cashier
router.post(
    "/",
    authorize("admin", "cashier"),
    createInvoice
);


module.exports = router;