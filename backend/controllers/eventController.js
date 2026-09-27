

const mongoose = require("mongoose");
const Event = require("../models/Event");

// GET all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .sort({ date: 1, createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: events.length,
            data: events,
        });

    } catch (error) {
        console.error("Get events error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch events",
        });
    }
};


// CREATE event
const createEvent = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Event data is required",
            });
        }

        const payload = { ...req.body };
        if (!payload.eventName) {
            if (typeof payload.title === 'string') {
                payload.eventName = payload.title;
            } else if (payload.title && typeof payload.title === 'object') {
                payload.eventName = payload.title.mr || payload.title.en || 'Untitled Event';
            } else {
                payload.eventName = 'Untitled Event';
            }
        }

        const event = await Event.create(payload);

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event,
        });

    } catch (error) {
        console.error("Create event error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Event validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create event",
        });
    }
};


// UPDATE event
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID",
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Update data is required",
            });
        }

        const event = await Event.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: event,
        });

    } catch (error) {
        console.error("Update event error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Event validation failed",
                errors: Object.values(error.errors).map(
                    (err) => err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update event",
        });
    }
};


// DELETE event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID",
            });
        }

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });

    } catch (error) {
        console.error("Delete event error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete event",
        });
    }
};


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};