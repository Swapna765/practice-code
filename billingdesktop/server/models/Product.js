const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        productCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        barcode: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        purchasePrice: {
            type: Number,
            required: true,
            min: 0
        },

        sellingPrice: {
            type: Number,
            required: true,
            min: 0
        },

        taxRate: {
            type: Number,
            default: 0,
            min: 0
        },

        stock: {
            type: Number,
            default: 0,
            min: 0
        },

        minimumStock: {
            type: Number,
            default: 5,
            min: 0
        },

        unit: {
            type: String,
            default: "piece",
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);