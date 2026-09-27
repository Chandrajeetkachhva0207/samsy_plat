

const mongoose = require("mongoose");
const Video = require("../models/Video");

// GET all videos
const getVideos = async (req, res) => {
    try {
        const videos = await Video.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: videos.length,
            data: videos,
        });

    } catch (error) {
        console.error("Get videos error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch videos",
        });
    }
};


// CREATE video
const createVideo = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Video data is required",
            });
        }

        const video = await Video.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Video added successfully",
            data: video,
        });

    } catch (error) {
        console.error("Create video error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Video validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create video",
        });
    }
};


// UPDATE video
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video ID",
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Update data is required",
            });
        }

        const video = await Video.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Video updated successfully",
            data: video,
        });

    } catch (error) {
        console.error("Update video error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Video validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update video",
        });
    }
};


// DELETE video
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid video ID",
            });
        }

        const video = await Video.findByIdAndDelete(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Video deleted successfully",
        });

    } catch (error) {
        console.error("Delete video error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete video",
        });
    }
};


module.exports = {
    getVideos,
    createVideo,
    updateVideo,
    deleteVideo,
};