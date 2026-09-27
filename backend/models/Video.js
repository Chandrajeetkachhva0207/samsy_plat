const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        // =========================================
        // BILINGUAL VIDEO TITLE
        // =========================================
        title: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },

        // =========================================
        // YOUTUBE URL
        // =========================================
        url: {
            type: String,
            required: true,
            trim: true,
        },

        // =========================================
        // VIDEO DATE
        // =========================================
        date: {
            type: String,
            default: "",
        },

        // =========================================
        // BILINGUAL DESCRIPTION
        // =========================================
        description: {
            type: mongoose.Schema.Types.Mixed,
            default: {
                mr: "",
                en: "",
            },
        },

        // =========================================
        // ACTIVE / INACTIVE
        // =========================================
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Video", videoSchema);