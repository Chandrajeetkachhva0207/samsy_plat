

const mongoose = require("mongoose");
const ContactMessage = require("../models/ContactMessage");


// PUBLIC - Submit contact form
const createContactMessage = async (req, res) => {
    try {
        const {
            name,
            mobile,
            email,
            subject,
            message,
        } = req.body;

        // Controller-level validation
        if (
            !name ||
            !mobile ||
            !email ||
            !subject ||
            !message
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const contactMessage = await ContactMessage.create({
            name: name.trim(),
            mobile: mobile.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Your message has been submitted successfully",
            data: {
                id: contactMessage._id,
            },
        });

    } catch (error) {
        console.error("Create contact message error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Contact form validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to submit your message",
        });
    }
};


// ADMIN - Get all messages
const getContactMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages,
        });

    } catch (error) {
        console.error("Get contact messages error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch contact messages",
        });
    }
};


// ADMIN - Update message status
const updateContactMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID",
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }

        const allowedStatuses = [
            "New",
            "Read",
            "Replied",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        const message = await ContactMessage.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message status updated successfully",
            data: message,
        });

    } catch (error) {
        console.error("Update contact message error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Message validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update message",
        });
    }
};


// ADMIN - Delete message
const deleteContactMessage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID",
            });
        }

        const message = await ContactMessage.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Message deleted successfully",
        });

    } catch (error) {
        console.error("Delete contact message error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete message",
        });
    }
};


module.exports = {
    createContactMessage,
    getContactMessages,
    updateContactMessage,
    deleteContactMessage,
};