const mongoose = require("mongoose");

const Video = require("../models/Video");

const cloudinary = require("../config/cloudinary");

// =====================================================
// GET ALL VIDEOS
// =====================================================

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
        console.error(
            "Get videos error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch videos",
        });
    }
};


// =====================================================
// CREATE VIDEO
// =====================================================

const createVideo = async (req, res) => {
    try {
        const {
            title,
            url,
            description,
            isActive,
        } = req.body;

        // =============================================
        // TITLE VALIDATION
        // =============================================

        if (!title) {
            return res.status(400).json({
                success: false,
                message:
                    "Video title is required",
            });
        }

        // =============================================
        // DIRECT VIDEO UPLOAD
        // =============================================

        if (req.file) {
            console.log(
                "Uploading video to Cloudinary..."
            );

            const uploadResult =
                await new Promise(
                    (resolve, reject) => {
                        const stream =
                            cloudinary.uploader.upload_stream(
                                {
                                    resource_type:
                                        "video",

                                    folder:
                                        "maa-narmada/videos",
                                },

                                (
                                    error,
                                    result
                                ) => {
                                    if (error) {
                                        reject(
                                            error
                                        );
                                    } else {
                                        resolve(
                                            result
                                        );
                                    }
                                }
                            );

                        stream.end(
                            req.file.buffer
                        );
                    }
                );

            const video =
                await Video.create({
                    title:
                        typeof title ===
                        "string"
                            ? JSON.parse(title)
                            : title,

                    url:
                        uploadResult.secure_url,

                    videoType:
                        "upload",

                    cloudinaryPublicId:
                        uploadResult.public_id,

                    description:
                        typeof description ===
                        "string"
                            ? JSON.parse(
                                  description
                              )
                            : description || {
                                  mr: "",
                                  en: "",
                              },

                    isActive:
                        isActive !== undefined
                            ? isActive ===
                              true ||
                              isActive ===
                              "true"
                            : true,
                });

            return res.status(201).json({
                success: true,
                message:
                    "Video uploaded successfully",
                data: video,
            });
        }

        // =============================================
        // YOUTUBE VIDEO
        // =============================================

        if (!url || !url.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide a YouTube URL or upload a video",
            });
        }

        if (
            !url.includes("youtube.com") &&
            !url.includes("youtu.be")
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide a valid YouTube URL",
            });
        }

        const video =
            await Video.create({
                title:
                    typeof title ===
                    "string"
                        ? JSON.parse(title)
                        : title,

                url: url.trim(),

                videoType:
                    "youtube",

                description:
                    typeof description ===
                    "string"
                        ? JSON.parse(
                              description
                          )
                        : description || {
                              mr: "",
                              en: "",
                          },

                isActive:
                    isActive !== undefined
                        ? isActive ===
                          true ||
                          isActive ===
                          "true"
                        : true,
            });

        return res.status(201).json({
            success: true,
            message:
                "YouTube video added successfully",
            data: video,
        });

    } catch (error) {
        console.error(
            "Create video error:",
            error
        );

        if (
            error.name ===
            "ValidationError"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Video validation failed",
                errors:
                    Object.values(
                        error.errors
                    ).map(
                        (err) =>
                            err.message
                    ),
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to create video",
        });
    }
};


// =====================================================
// UPDATE VIDEO
// =====================================================

const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid video ID",
            });
        }

        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Update data is required",
            });
        }

        const video =
            await Video.findByIdAndUpdate(
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
                message:
                    "Video not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Video updated successfully",
            data: video,
        });

    } catch (error) {
        console.error(
            "Update video error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update video",
        });
    }
};


// =====================================================
// DELETE VIDEO
// =====================================================

const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid video ID",
            });
        }

        const video =
            await Video.findById(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message:
                    "Video not found",
            });
        }

        // =============================================
        // DELETE CLOUDINARY VIDEO
        // =============================================

        if (
            video.videoType ===
                "upload" &&
            video.cloudinaryPublicId
        ) {
            try {
                await cloudinary.uploader.destroy(
                    video.cloudinaryPublicId,
                    {
                        resource_type:
                            "video",
                    }
                );
            } catch (cloudinaryError) {
                console.error(
                    "Cloudinary delete error:",
                    cloudinaryError
                );
            }
        }

        // =============================================
        // DELETE DATABASE RECORD
        // =============================================

        await Video.findByIdAndDelete(
            id
        );

        return res.status(200).json({
            success: true,
            message:
                "Video deleted successfully",
        });

    } catch (error) {
        console.error(
            "Delete video error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to delete video",
        });
    }
};


module.exports = {
    getVideos,
    createVideo,
    updateVideo,
    deleteVideo,
};