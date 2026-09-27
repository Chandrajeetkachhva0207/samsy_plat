const mongoose = require("mongoose");

const gurukulSchema = new mongoose.Schema(
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

        purpose: {
            type: String,
            trim: true,
            default: "",
        },

        educationalApproach: {
            type: String,
            trim: true,
            default: "",
        },

        schoolEducation: {
            type: String,
            trim: true,
            default: "",
        },

        studyGuidance: {
            type: String,
            trim: true,
            default: "",
        },

        prayer: {
            type: String,
            trim: true,
            default: "",
        },

        namasmaran: {
            type: String,
            trim: true,
            default: "",
        },

        saintThoughts: {
            type: String,
            trim: true,
            default: "",
        },

        spiritualLearning: {
            type: String,
            trim: true,
            default: "",
        },

        values: {
            type: [String],
            default: [],
        },

        discipline: {
            type: String,
            trim: true,
            default: "",
        },

        dailyActivities: {
            type: [String],
            default: [],
        },

        workingMethod: {
            type: String,
            trim: true,
            default: "",
        },

        studentActivities: {
            type: [String],
            default: [],
        },

        facilities: {
            type: [String],
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

module.exports = mongoose.model("Gurukul", gurukulSchema);