const express = require("express");

const {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
} = require("../controllers/supplierController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// All supplier APIs require login
router.use(protect);


// View suppliers
router.get(
    "/",
    getSuppliers
);


// View one supplier
router.get(
    "/:id",
    getSupplierById
);


// Create supplier
router.post(
    "/",
    authorize("admin"),
    createSupplier
);


// Update supplier
router.put(
    "/:id",
    authorize("admin"),
    updateSupplier
);


// Deactivate supplier
router.delete(
    "/:id",
    authorize("admin"),
    deleteSupplier
);


module.exports = router;