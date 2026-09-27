
const mongoose = require("mongoose");
const Facility = require("../models/Facility");

// GET all facilities
const getFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find().sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: facilities.length,
            data: facilities,
        });

    } catch (error) {
        console.error("Get facilities error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch facilities",
        });
    }
};


// CREATE facility
const createFacility = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Facility data is required",
            });
        }

        const facility = await Facility.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Facility created successfully",
            data: facility,
        });

    } catch (error) {
        console.error("Create facility error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Facility validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create facility",
        });
    }
};


// UPDATE facility
const updateFacility = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid facility ID",
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Update data is required",
            });
        }

        const facility = await Facility.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!facility) {
            return res.status(404).json({
                success: false,
                message: "Facility not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Facility updated successfully",
            data: facility,
        });

    } catch (error) {
        console.error("Update facility error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Facility validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update facility",
        });
    }
};


// DELETE facility
const deleteFacility = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid facility ID",
            });
        }

        const facility = await Facility.findByIdAndDelete(id);

        if (!facility) {
            return res.status(404).json({
                success: false,
                message: "Facility not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Facility deleted successfully",
        });

    } catch (error) {
        console.error("Delete facility error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete facility",
        });
    }
};


module.exports = {
    getFacilities,
    createFacility,
    updateFacility,
    deleteFacility,
};