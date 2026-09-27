const mongoose = require("mongoose");

const futurePlanSchema = new mongoose.Schema(
    {
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

        status: {
            type: String,
            enum: ["Future", "Proposed"],
            default: "Future",
        },

        items: {
            type: [String],
            default: [],
        },

        image: {
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

module.exports = mongoose.model("FuturePlan", futurePlanSchema);