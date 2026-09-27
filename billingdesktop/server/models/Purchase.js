const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        purchasePrice: {
            type: Number,
            required: true,
            min: 0
        },

        taxRate: {
            type: Number,
            default: 0,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { _id: false }
);


const purchaseSchema = new mongoose.Schema(
    {
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true
        },

        invoiceNumber: {
            type: String,
            required: true,
            trim: true
        },

        items: {
            type: [purchaseItemSchema],
            required: true
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        taxAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        grandTotal: {
            type: Number,
            required: true,
            min: 0
        },

        purchaseDate: {
            type: Date,
            default: Date.now
        },

        paymentStatus: {
            type: String,
            enum: ["paid", "pending", "partial"],
            default: "paid"
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "Purchase",
    purchaseSchema
);