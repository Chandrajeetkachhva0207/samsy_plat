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
        // VIDEO URL
        // =========================================
        //
        // YouTube URL OR Cloudinary video URL
        // =========================================

        url: {
            type: String,
            required: true,
            trim: true,
        },

        // =========================================
        // VIDEO TYPE
        // =========================================
        //
        // youtube = YouTube video
        // upload  = Cloudinary uploaded video
        // =========================================

        videoType: {
            type: String,
            enum: ["youtube", "upload"],
            default: "youtube",
        },

        // =========================================
        // CLOUDINARY PUBLIC ID
        // =========================================
        //
        // Used when deleting uploaded videos
        // =========================================

        cloudinaryPublicId: {
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

module.exports = mongoose.model(
    "Video",
    videoSchema
);