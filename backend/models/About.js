const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            default: "",
        },

        introduction: {
            type: String,
            trim: true,
            default: "",
        },

        establishment: {
            type: String,
            trim: true,
            default: "",
        },

        alandiWork: {
            type: String,
            trim: true,
            default: "",
        },

        journey: {
            type: String,
            trim: true,
            default: "",
        },

        vision: {
            type: String,
            trim: true,
            default: "",
        },

        objectives: {
            type: [String],
            default: [],
        },

        education: {
            type: String,
            trim: true,
            default: "",
        },

        indianCulture: {
            type: String,
            trim: true,
            default: "",
        },

        warkariTradition: {
            type: String,
            trim: true,
            default: "",
        },

        futureGoals: {
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

module.exports = mongoose.model("About", aboutSchema);