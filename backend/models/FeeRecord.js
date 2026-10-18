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
        installmentName: {
            type: String,
            trim: true,
            default: "", // e.g. "हप्ता १ (Installment 1)", "प्रवेश शुल्क (Admission Fee)"
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

const feeHistorySchema = new mongoose.Schema(
    {
        changedAt: {
            type: Date,
            default: Date.now,
        },
        changedBy: {
            type: String,
            default: "Admin",
        },
        oldTotal: {
            type: Number,
            default: 0,
        },
        newTotal: {
            type: Number,
            default: 0,
        },
        reason: {
            type: String,
            default: "Course fee updated",
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
        feeHistory: [feeHistorySchema],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for payment status: Paid, Partially Paid, Pending, Unassigned
feeRecordSchema.virtual("status").get(function () {
    const total = this.totalFees || 0;
    const paid = this.paidFees || 0;
    if (total <= 0) return "Unassigned";
    if (paid >= total) return "Paid";
    if (paid > 0) return "Partially Paid";
    return "Pending";
});

// Virtual for percentage of fees paid
feeRecordSchema.virtual("paymentPercentage").get(function () {
    const total = this.totalFees || 0;
    const paid = this.paidFees || 0;
    if (total <= 0) return 0;
    return Math.min(100, Math.round((paid / total) * 100));
});

// Pre-save hook to calculate paidFees and remainingFees automatically
feeRecordSchema.pre("save", function (next) {
    if (this.payments && this.payments.length > 0) {
        this.paidFees = this.payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    } else {
        this.paidFees = 0;
    }
    this.remainingFees = Math.max(0, (this.totalFees || 0) - (this.paidFees || 0));
    if (typeof next === "function") next();
});

module.exports = mongoose.model("FeeRecord", feeRecordSchema);
