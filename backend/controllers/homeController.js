
const Home = require("../models/Home");

// =====================================================
// GET HOME
// Public
// =====================================================

const getHome = async (req, res) => {
    try {
        const home = await Home.findOne();

        if (!home) {
            return res.status(404).json({
                success: false,
                message: "Homepage content not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: home,
        });

    } catch (error) {
        console.error("Get home error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch homepage content",
        });
    }
};


// =====================================================
// CREATE HOME
// Admin only
// =====================================================

const createHome = async (req, res) => {
    try {
        const existingHome = await Home.findOne();

        if (existingHome) {
            return res.status(409).json({
                success: false,
                message:
                    "Homepage content already exists. Use PUT to update it.",
            });
        }

        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Homepage content is required",
            });
        }

        const home = await Home.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Homepage content created successfully",
            data: home,
        });

    } catch (error) {
        console.error("Create home error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid homepage data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create homepage content",
        });
    }
};


// =====================================================
// UPDATE HOME
// Admin only
// =====================================================

const updateHome = async (req, res) => {
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

        const home = await Home.findOne();

        if (!home) {
            return res.status(404).json({
                success: false,
                message:
                    "Homepage content not found. Create it first.",
            });
        }

        const updatedHome = await Home.findByIdAndUpdate(
            home._id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Homepage content updated successfully",
            data: updatedHome,
        });

    } catch (error) {
        console.error("Update home error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid homepage data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update homepage content",
        });
    }
};


module.exports = {
    getHome,
    createHome,
    updateHome,
};