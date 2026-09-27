
const About = require("../models/About");

// =====================================================
// GET ABOUT
// Public
// =====================================================

const getAbout = async (req, res) => {
    try {
        const about = await About.findOne();

        if (!about) {
            return res.status(404).json({
                success: false,
                message: "About Us content not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: about,
        });

    } catch (error) {
        console.error("Get About error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch About Us content",
        });
    }
};


// =====================================================
// CREATE ABOUT
// Admin only
// =====================================================

const createAbout = async (req, res) => {
    try {
        const existingAbout = await About.findOne();

        if (existingAbout) {
            return res.status(409).json({
                success: false,
                message:
                    "About Us content already exists. Use PUT to update it.",
            });
        }

        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "About Us content is required",
            });
        }

        const about = await About.create(req.body);

        return res.status(201).json({
            success: true,
            message: "About Us content created successfully",
            data: about,
        });

    } catch (error) {
        console.error("Create About error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid About Us data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create About Us content",
        });
    }
};


// =====================================================
// UPDATE ABOUT
// Admin only
// =====================================================

const updateAbout = async (req, res) => {
    try {
        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Update data is required",
            });
        }

        const about = await About.findOne();

        if (!about) {
            return res.status(404).json({
                success: false,
                message:
                    "About Us content not found. Create it first.",
            });
        }

        const updatedAbout = await About.findByIdAndUpdate(
            about._id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "About Us content updated successfully",
            data: updatedAbout,
        });

    } catch (error) {
        console.error("Update About error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid About Us data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update About Us content",
        });
    }
};


module.exports = {
    getAbout,
    createAbout,
    updateAbout,
};