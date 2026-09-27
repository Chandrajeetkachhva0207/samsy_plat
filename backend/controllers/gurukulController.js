

const Gurukul = require("../models/Gurukul");

// =====================================================
// GET GURUKUL
// Public
// =====================================================

const getGurukul = async (req, res) => {
    try {
        const gurukul = await Gurukul.findOne();

        if (!gurukul) {
            return res.status(404).json({
                success: false,
                message: "Gurukul content not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: gurukul,
        });

    } catch (error) {
        console.error("Get Gurukul error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch Gurukul content",
        });
    }
};


// =====================================================
// CREATE GURUKUL
// Admin only
// =====================================================

const createGurukul = async (req, res) => {
    try {
        const existingGurukul = await Gurukul.findOne();

        if (existingGurukul) {
            return res.status(409).json({
                success: false,
                message:
                    "Gurukul content already exists. Use PUT to update it.",
            });
        }

        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Gurukul content is required",
            });
        }

        const gurukul = await Gurukul.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Gurukul content created successfully",
            data: gurukul,
        });

    } catch (error) {
        console.error("Create Gurukul error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid Gurukul data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create Gurukul content",
        });
    }
};


// =====================================================
// UPDATE GURUKUL
// Admin only
// =====================================================

const updateGurukul = async (req, res) => {
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

        const gurukul = await Gurukul.findOne();

        if (!gurukul) {
            return res.status(404).json({
                success: false,
                message:
                    "Gurukul content not found. Create it first.",
            });
        }

        const updatedGurukul =
            await Gurukul.findByIdAndUpdate(
                gurukul._id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        return res.status(200).json({
            success: true,
            message:
                "Gurukul content updated successfully",
            data: updatedGurukul,
        });

    } catch (error) {
        console.error("Update Gurukul error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid Gurukul data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update Gurukul content",
        });
    }
};


module.exports = {
    getGurukul,
    createGurukul,
    updateGurukul,
};