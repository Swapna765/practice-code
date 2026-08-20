const express = require("express");

const {
    createPurchase,
    getPurchases,
    getPurchaseById
} = require("../controllers/purchaseController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// All purchase routes require login
router.use(protect);


// Get purchases
router.get(
    "/",
    getPurchases
);


// Get one purchase
router.get(
    "/:id",
    getPurchaseById
);


// Create purchase
// Admin only
router.post(
    "/",
    authorize("admin"),
    createPurchase
);


module.exports = router;