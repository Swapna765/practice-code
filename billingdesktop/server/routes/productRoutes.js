const express = require("express");

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByBarcode
} = require("../controllers/productController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();


// All product APIs require login
router.use(protect);


// Get all products
router.get("/", getProducts);


// Search by barcode
router.get(
    "/barcode/:barcode",
    getProductByBarcode
);


// Get single product
router.get("/:id", getProduct);


// Create product - admin only
router.post(
    "/",
    authorize("admin"),
    createProduct
);


// Update product - admin only
router.put(
    "/:id",
    authorize("admin"),
    updateProduct
);


// Delete product - admin only
router.delete(
    "/:id",
    authorize("admin"),
    deleteProduct
);


module.exports = router;





// 6a850c7a58abb4e78d6c0886