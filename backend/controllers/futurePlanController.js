
const mongoose = require("mongoose");
const FuturePlan = require("../models/FuturePlan");

// GET all future plans
const getFuturePlans = async (req, res) => {
    try {
        const plans = await FuturePlan.find()
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: plans.length,
            data: plans,
        });

    } catch (error) {
        console.error("Get future plans error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch future plans",
        });
    }
};


// CREATE future plan
const createFuturePlan = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Future plan data is required",
            });
        }

        const plan = await FuturePlan.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Future plan created successfully",
            data: plan,
        });

    } catch (error) {
        console.error("Create future plan error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Future plan validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create future plan",
        });
    }
};


// UPDATE future plan
const updateFuturePlan = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid future plan ID",
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Update data is required",
            });
        }

        const plan = await FuturePlan.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Future plan not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Future plan updated successfully",
            data: plan,
        });

    } catch (error) {
        console.error("Update future plan error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Future plan validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update future plan",
        });
    }
};


// DELETE future plan
const deleteFuturePlan = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid future plan ID",
            });
        }

        const plan = await FuturePlan.findByIdAndDelete(id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Future plan not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Future plan deleted successfully",
        });

    } catch (error) {
        console.error("Delete future plan error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete future plan",
        });
    }
};


module.exports = {
    getFuturePlans,
    createFuturePlan,
    updateFuturePlan,
    deleteFuturePlan,
};