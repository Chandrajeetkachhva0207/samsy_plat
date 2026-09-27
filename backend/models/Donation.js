const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
    {
        donorName: {
            type: String,
            trim: true,
            default: "भाविक देणगीदार",
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },
        phone: {
            type: String,
            trim: true,
            default: "",
        },
        panNumber: {
            type: String,
            trim: true,
            uppercase: true,
            default: "",
        },
        profession: {
            type: String,
            trim: true,
            default: "",
        },
        amount: {
            type: Number,
            required: [true, "Donation amount is required"],
            min: [1, "Amount must be at least ₹1"],
        },
        currency: {
            type: String,
            default: "INR",
        },
        donationType: {
            type: String,
            enum: [
                "General Donation",
                "Annadanam (अन्नदान)",
                "Student Education (विद्यार्थी शिक्षण)",
                "Gurukul Infrastructure (गुरुकुल विकास)",
                "Gau Seva (गोसेवा)",
                "Other",
            ],
            default: "General Donation",
        },
        razorpayOrderId: {
            type: String,
            required: true,
            index: true,
        },
        razorpayPaymentId: {
            type: String,
            default: "",
        },
        razorpaySignature: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["created", "captured", "failed"],
            default: "created",
        },
        receiptNumber: {
            type: String,
            unique: true,
            sparse: true,
        },
        address: {
            type: String,
            trim: true,
            default: "",
        },
        notes: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Donation", donationSchema);
