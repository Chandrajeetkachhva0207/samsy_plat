const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        receiptNo: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        paymentMode: {
            type: String,
            enum: ["Cash", "UPI", "Bank Transfer", "Cheque", "Online"],
            default: "Cash",
        },
        transactionRef: {
            type: String,
            trim: true,
            default: "",
        },
        receivedBy: {
            type: String,
            default: "Office Admin",
        },
        notes: {
            type: String,
            default: "",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true }
);

const feeRecordSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        studentProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentProfile",
            required: true,
        },
        studentId: {
            type: String,
            default: "",
            index: true,
        },
        academicYear: {
            type: String,
            default: "2025-2026",
        },
        totalFees: {
            type: Number,
            default: 0,
            min: 0,
        },
        paidFees: {
            type: Number,
            default: 0,
            min: 0,
        },
        remainingFees: {
            type: Number,
            default: 0,
        },
        nextDueDate: {
            type: String,
            default: "",
        },
        feeScheduleNotes: {
            type: String,
            default: "",
        },
        payments: [paymentSchema],
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to calculate remaining fees automatically
feeRecordSchema.pre("save", function (next) {
    if (this.payments && this.payments.length > 0) {
        this.paidFees = this.payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    }
    this.remainingFees = Math.max(0, (this.totalFees || 0) - (this.paidFees || 0));
    if (typeof next === "function") next();
});

module.exports = mongoose.model("FeeRecord", feeRecordSchema);
