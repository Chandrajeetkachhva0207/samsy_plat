

const mongoose = require("mongoose");
const Journey = require("../models/Journey");

// =====================================================
// GET ALL JOURNEY ENTRIES
// Public
// =====================================================

const getJourneys = async (req, res) => {
    try {
        const journeys = await Journey.find()
            .sort({ year: 1 });

        return res.status(200).json({
            success: true,
            count: journeys.length,
            data: journeys,
        });

    } catch (error) {
        console.error("Get journeys error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch journey entries",
        });
    }
};


// =====================================================
// CREATE JOURNEY ENTRY
// Admin only
// =====================================================

const createJourney = async (req, res) => {
    try {
        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Journey data is required",
            });
        }

        const journey = await Journey.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Journey entry created successfully",
            data: journey,
        });

    } catch (error) {
        console.error("Create journey error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid journey data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create journey entry",
        });
    }
};


// =====================================================
// UPDATE JOURNEY ENTRY
// Admin only
// =====================================================

const updateJourney = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid journey ID",
            });
        }

        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Update data is required",
            });
        }

        const journey = await Journey.findById(id);

        if (!journey) {
            return res.status(404).json({
                success: false,
                message: "Journey entry not found",
            });
        }

        const updatedJourney =
            await Journey.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        return res.status(200).json({
            success: true,
            message: "Journey entry updated successfully",
            data: updatedJourney,
        });

    } catch (error) {
        console.error("Update journey error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid journey data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update journey entry",
        });
    }
};


// =====================================================
// DELETE JOURNEY ENTRY
// Admin only
// =====================================================

const deleteJourney = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid journey ID",
            });
        }

        const journey = await Journey.findById(id);

        if (!journey) {
            return res.status(404).json({
                success: false,
                message: "Journey entry not found",
            });
        }

        await Journey.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Journey entry deleted successfully",
        });

    } catch (error) {
        console.error("Delete journey error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete journey entry",
        });
    }
};


module.exports = {
    getJourneys,
    createJourney,
    updateJourney,
    deleteJourney,
};