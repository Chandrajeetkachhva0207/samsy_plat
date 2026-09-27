const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "School Education",
                "Spiritual Education",
                "Warkari Values & Tradition",
                "Children's Sanskar Camps",
                "Kirtan/Pravachan",
                "Cultural Activities",
                "Social Activities",
            ],
        },

        description: {
            type: String,
            trim: true,
            default: "",
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

module.exports = mongoose.model("Activity", activitySchema);