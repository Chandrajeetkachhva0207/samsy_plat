const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            default: "Support Us",
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        bankName: {
            type: String,
            trim: true,
            default: "",
        },

        accountName: {
            type: String,
            trim: true,
            default: "",
        },

        accountNumber: {
            type: String,
            trim: true,
            default: "",
        },

        ifscCode: {
            type: String,
            trim: true,
            default: "",
        },

        branch: {
            type: String,
            trim: true,
            default: "",
        },

        upiId: {
            type: String,
            trim: true,
            default: "",
        },

        qrCode: {
            type: String,
            default: "",
        },

        paymentGatewayUrl: {
            type: String,
            trim: true,
            default: "",
        },

        receiptInfo: {
            type: String,
            trim: true,
            default: "",
        },

        taxInfo: {
            type: String,
            trim: true,
            default: "",
        },

        registrationInfo: {
            type: String,
            trim: true,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Support", supportSchema);