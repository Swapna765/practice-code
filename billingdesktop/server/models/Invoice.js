const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        name: {
            type: String,
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

        taxRate: {
            type: Number,
            default: 0,
            min: 0
        },

        taxAmount: {
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


const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            default: null
        },

        items: {
            type: [invoiceItemSchema],
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

        paymentMethod: {
            type: String,
            enum: [
                "cash",
                "card",
                "upi",
                "credit"
            ],
            default: "cash"
        },

        paymentStatus: {
            type: String,
            enum: [
                "paid",
                "pending",
                "partial"
            ],
            default: "paid"
        },

        amountPaid: {
            type: Number,
            default: 0,
            min: 0
        },

        changeAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        soldBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        invoiceDate: {
            type: Date,
            default: Date.now
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
    "Invoice",
    invoiceSchema
);