const express = require("express");

const {
    getDashboard
} = require("../controllers/dashboardController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// Dashboard requires login
router.use(protect);


// GET dashboard
router.get(
    "/",
    getDashboard
);


module.exports = router;