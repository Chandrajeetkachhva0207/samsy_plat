const mongoose = require("mongoose");

const annualReportSchema = new mongoose.Schema(
    {
        title: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },

        year: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },

        description: {
            type: mongoose.Schema.Types.Mixed,
            default: {
                mr: "",
                en: "",
            },
        },

        pdf: {
            type: String,
            required: true,
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

module.exports = mongoose.model(
    "AnnualReport",
    annualReportSchema
);