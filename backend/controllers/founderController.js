
const Founder = require("../models/Founder");

// =====================================================
// GET FOUNDER
// Public
// =====================================================

const getFounder = async (req, res) => {
    try {
        const founder = await Founder.findOne();

        if (!founder) {
            return res.status(404).json({
                success: false,
                message: "Founder information not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: founder,
        });

    } catch (error) {
        console.error("Get founder error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch founder information",
        });
    }
};


// =====================================================
// CREATE FOUNDER
// Admin only
// =====================================================

const createFounder = async (req, res) => {
    try {
        const existingFounder = await Founder.findOne();

        if (existingFounder) {
            return res.status(409).json({
                success: false,
                message:
                    "Founder information already exists. Use PUT to update it.",
            });
        }

        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Founder information is required",
            });
        }

        const founder = await Founder.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Founder information created successfully",
            data: founder,
        });

    } catch (error) {
        console.error("Create founder error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid founder data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create founder information",
        });
    }
};


// =====================================================
// UPDATE FOUNDER
// Admin only
// =====================================================

const updateFounder = async (req, res) => {
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

        const founder = await Founder.findOne();

        if (!founder) {
            return res.status(404).json({
                success: false,
                message:
                    "Founder information not found. Create it first.",
            });
        }

        const updatedFounder =
            await Founder.findByIdAndUpdate(
                founder._id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        return res.status(200).json({
            success: true,
            message:
                "Founder information updated successfully",
            data: updatedFounder,
        });

    } catch (error) {
        console.error("Update founder error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid founder data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Unable to update founder information",
        });
    }
};


module.exports = {
    getFounder,
    createFounder,
    updateFounder,
};