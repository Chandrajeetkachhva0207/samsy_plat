const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        mobile: {
            type: String,
            trim: true,
            default: "",
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["user", "student", "admin"],
            default: "student",
        },

        // For forgot password OTP flow
        resetPasswordOtp: {
            type: String,
            default: null,
        },

        resetPasswordExpires: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);