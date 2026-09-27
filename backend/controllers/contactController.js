

const Contact = require("../models/Contact");

// GET contact details
const getContact = async (req, res) => {
    try {
        const contact = await Contact.findOne();

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact details not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: contact,
        });

    } catch (error) {
        console.error("Get contact error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch contact details",
        });
    }
};


// CREATE contact details
const createContact = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Contact details are required",
            });
        }

        const existingContact = await Contact.findOne();

        if (existingContact) {
            return res.status(409).json({
                success: false,
                message: "Contact details already exist. Use PUT to update.",
            });
        }

        const contact = await Contact.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Contact details created successfully",
            data: contact,
        });

    } catch (error) {
        console.error("Create contact error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Contact details validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create contact details",
        });
    }
};


// UPDATE contact details
const updateContact = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Update data is required",
            });
        }

        const contact = await Contact.findOneAndUpdate(
            {},
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact details not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact details updated successfully",
            data: contact,
        });

    } catch (error) {
        console.error("Update contact error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Contact details validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update contact details",
        });
    }
};


module.exports = {
    getContact,
    createContact,
    updateContact,
};