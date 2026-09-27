const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            trim: true,
            default: function() {
                if (typeof this.title === 'string') return this.title;
                if (this.title && typeof this.title === 'object') return this.title.mr || this.title.en || 'Untitled Event';
                return 'Untitled Event';
            }
        },

        title: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        date: {
            type: String,
            default: "",
        },

        day: {
            type: String,
            default: "",
        },

        time: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            trim: true,
            default: "",
        },

        venue: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        category: {
            type: String,
            default: "general",
        },

        kirtankarSpeaker: {
            type: String,
            trim: true,
            default: "",
        },

        chiefGuest: {
            type: String,
            trim: true,
            default: "",
        },

        description: {
            type: mongoose.Schema.Types.Mixed,
            default: "",
        },

        photos: {
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
        strict: false,
    }
);

module.exports = mongoose.model("Event", eventSchema);