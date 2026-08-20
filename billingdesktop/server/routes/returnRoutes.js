const express = require("express");

const {
    createReturn,
    getReturns,
    getReturnById
} = require("../controllers/returnController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// All return routes require login
router.use(protect);


// Get all returns
router.get(
    "/",
    getReturns
);


// Get one return
router.get(
    "/:id",
    getReturnById
);


// Process return
// Admin + Cashier
router.post(
    "/",
    authorize("admin", "cashier"),
    createReturn
);


module.exports = router;