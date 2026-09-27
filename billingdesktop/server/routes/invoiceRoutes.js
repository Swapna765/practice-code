const express = require("express");

const {
    createInvoice,
    getInvoices,
    getInvoice,
    getInvoiceByNumber
} = require("../controllers/invoiceController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// All invoice APIs require login
router.use(protect);


// ==========================================
// GET ALL INVOICES
// ==========================================
router.get(
    "/",
    getInvoices
);


// ==========================================
// GET BY INVOICE NUMBER
// ==========================================
router.get(
    "/number/:invoiceNumber",
    getInvoiceByNumber
);


// ==========================================
// GET SINGLE INVOICE
// ==========================================
router.get(
    "/:id",
    getInvoice
);


// ==========================================
// CREATE INVOICE
// ADMIN + CASHIER
// ==========================================
router.post(
    "/",
    authorize("admin", "cashier"),
    createInvoice
);


module.exports = router;