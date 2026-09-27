const mongoose = require("mongoose");

const founderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        designation: {
            type: String,
            trim: true,
            default: "",
        },

        photo: {
            type: String,
            default: "",
        },

        biography: {
            type: String,
            trim: true,
            default: "",
        },

        role: {
            type: String,
            trim: true,
            default: "",
        },

        contribution: {
            type: String,
            trim: true,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Founder", founderSchema);