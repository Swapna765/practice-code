const mongoose = require("mongoose");

const returnItemSchema = new mongoose.Schema(
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

        price: {
            type: Number,
            required: true,
            min: 0
        },

        refundAmount: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { _id: false }
);

const returnSchema = new mongoose.Schema(
    {
        returnNumber: {
            type: String,
            required: true,
            unique: true
        },

        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            default: null
        },

        items: {
            type: [returnItemSchema],
            required: true
        },

        totalRefund: {
            type: Number,
            required: true,
            min: 0
        },

        reason: {
            type: String,
            trim: true
        },

        refundMethod: {
            type: String,
            enum: ["cash", "card", "upi", "credit"],
            default: "cash"
        },

        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        returnDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Return", returnSchema);