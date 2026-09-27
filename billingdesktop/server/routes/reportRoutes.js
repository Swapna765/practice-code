const express = require("express");

const {
    getSalesReport,
    getPurchaseReport,
    getReturnReport,
    getProfitReport
} = require("../controllers/reportController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// All report APIs require login
router.use(protect);


// Sales report
router.get(
    "/sales",
    authorize("admin"),
    getSalesReport
);


// Purchase report
router.get(
    "/purchases",
    authorize("admin"),
    getPurchaseReport
);


// Return report
router.get(
    "/returns",
    authorize("admin"),
    getReturnReport
);


// Profit report
router.get(
    "/profit",
    authorize("admin"),
    getProfitReport
);


module.exports = router;