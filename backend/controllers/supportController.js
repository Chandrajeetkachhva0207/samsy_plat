
const Support = require("../models/Support");

// GET support details
const getSupport = async (req, res) => {
    try {
        const support = await Support.findOne();

        if (!support) {
            return res.status(404).json({
                success: false,
                message: "Support details not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: support,
        });

    } catch (error) {
        console.error("Get support error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch support details",
        });
    }
};


// CREATE support details
const createSupport = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Support details are required",
            });
        }

        const existingSupport = await Support.findOne();

        if (existingSupport) {
            return res.status(409).json({
                success: false,
                message: "Support details already exist. Use PUT to update.",
            });
        }

        const support = await Support.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Support details created successfully",
            data: support,
        });

    } catch (error) {
        console.error("Create support error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Support details validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create support details",
        });
    }
};


// UPDATE support details
const updateSupport = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Update data is required",
            });
        }

        const support = await Support.findOneAndUpdate(
            {},
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!support) {
            return res.status(404).json({
                success: false,
                message: "Support details not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Support details updated successfully",
            data: support,
        });

    } catch (error) {
        console.error("Update support error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Support details validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update support details",
        });
    }
};


module.exports = {
    getSupport,
    createSupport,
    updateSupport,
};