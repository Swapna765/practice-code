const express = require("express");

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getCategories);

router.get("/:id", getCategory);

router.post(
    "/",
    authorize("admin"),
    createCategory
);

router.put(
    "/:id",
    authorize("admin"),
    updateCategory
);

router.delete(
    "/:id",
    authorize("admin"),
    deleteCategory
);

module.exports = router;