const mongoose = require("mongoose");

const buttonSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
            trim: true,
        },

        link: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const homeSchema = new mongoose.Schema(
    {
        heroTitle: {
            type: String,
            trim: true,
            default: "",
        },

        heroSubtitle: {
            type: String,
            trim: true,
            default: "",
        },

        tagline: {
            type: String,
            trim: true,
            default: "",
        },

        heroImage: {
            type: String,
            default: "",
        },

        introTitle: {
            type: String,
            trim: true,
            default: "",
        },

        introText: {
            type: String,
            trim: true,
            default: "",
        },

        buttons: {
            type: [buttonSchema],
            default: [],
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

module.exports = mongoose.model("Home", homeSchema);