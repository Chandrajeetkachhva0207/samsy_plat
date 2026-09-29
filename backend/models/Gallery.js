const mongoose = require("mongoose");


const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: mongoose.Schema.Types.Mixed,
            default: "",
        },


        category: {
            type: String,
            default: "general",
        },


        image: {
            type: String,
            default: "",
        },


        // Kept for compatibility
        // with existing gallery records
        imageUrl: {
            type: String,
            default: "",
        },

        cloudinaryPublicId: {
            type: String,
            default: "",
        },

        caption: {
            type: mongoose.Schema.Types.Mixed,
            default: "",
        },


        description: {
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

        // Allows compatibility
        // with older records/fields
        strict: false,
    }
);


module.exports =
    mongoose.model(
        "Gallery",
        gallerySchema
    );