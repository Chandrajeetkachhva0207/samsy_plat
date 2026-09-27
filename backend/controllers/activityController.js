

const mongoose = require("mongoose");
const Activity = require("../models/Activity");

// =====================================================
// GET ALL ACTIVITIES
// Public
// =====================================================

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: activities.length,
            data: activities,
        });

    } catch (error) {
        console.error("Get activities error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch activities",
        });
    }
};


// =====================================================
// CREATE ACTIVITY
// Admin only
// =====================================================

const createActivity = async (req, res) => {
    try {
        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Activity data is required",
            });
        }

        const activity = await Activity.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Activity created successfully",
            data: activity,
        });

    } catch (error) {
        console.error("Create activity error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid activity data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create activity",
        });
    }
};


// =====================================================
// UPDATE ACTIVITY
// Admin only
// =====================================================

const updateActivity = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID",
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

        const updatedActivity =
            await Activity.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedActivity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Activity updated successfully",
            data: updatedActivity,
        });

    } catch (error) {
        console.error("Update activity error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Invalid activity data",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update activity",
        });
    }
};


// =====================================================
// DELETE ACTIVITY
// Admin only
// =====================================================

const deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID",
            });
        }

        const activity =
            await Activity.findByIdAndDelete(id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Activity deleted successfully",
        });

    } catch (error) {
        console.error("Delete activity error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete activity",
        });
    }
};


module.exports = {
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity,
};