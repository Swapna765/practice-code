const express = require("express");

const {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomerByPhone
} = require("../controllers/customerController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);


// Get all customers
router.get(
    "/",
    getCustomers
);


// Search customer by phone
router.get(
    "/phone/:phone",
    searchCustomerByPhone
);


// Get single customer
router.get(
    "/:id",
    getCustomer
);


// Create customer
router.post(
    "/",
    authorize("admin", "cashier"),
    createCustomer
);


// Update customer
router.put(
    "/:id",
    authorize("admin", "cashier"),
    updateCustomer
);


// Delete customer
router.delete(
    "/:id",
    authorize("admin"),
    deleteCustomer
);


module.exports = router;