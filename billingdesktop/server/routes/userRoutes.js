const express = require("express");

const {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// All user routes require login
router.use(protect);


// Only admin can manage users
router.use(adminOnly);


// Get all users
router.get(
    "/",
    getUsers
);


// Create cashier/admin
router.post(
    "/",
    createUser
);


// Update user
router.put(
    "/:id",
    updateUser
);


// Deactivate user
router.delete(
    "/:id",
    deleteUser
);


module.exports = router;