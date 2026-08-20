const express = require("express");

const {
    getInventory,
    stockIn,
    stockOut,
    adjustStock,
    getLowStock
} = require("../controllers/inventoryController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// ALL INVENTORY ROUTES REQUIRE LOGIN
// ==========================================

router.use(protect);


// ==========================================
// GET INVENTORY
// ==========================================

router.get(
    "/",
    getInventory
);


// ==========================================
// LOW STOCK
// ==========================================

router.get(
    "/low-stock",
    getLowStock
);


// ==========================================
// STOCK IN
// ADMIN ONLY
// ==========================================

router.post(
    "/stock-in",
    authorize("admin"),
    stockIn
);


// ==========================================
// STOCK OUT
// ADMIN + CASHIER
// ==========================================

router.post(
    "/stock-out",
    authorize("admin", "cashier"),
    stockOut
);


// ==========================================
// ADJUST STOCK
// ADMIN ONLY
// ==========================================

router.put(
    "/adjust",
    authorize("admin"),
    adjustStock
);


module.exports = router;