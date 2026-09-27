const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema(
    {
        year: {
            type: String,
            required: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        activities: {
            type: [String],
            default: [],
        },

        milestones: {
            type: [String],
            default: [],
        },

        achievements: {
            type: [String],
            default: [],
        },

        photo: {
            type: String,
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

module.exports = mongoose.model("Journey", journeySchema);