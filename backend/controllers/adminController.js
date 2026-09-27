const Home = require("../models/Home");
const About = require("../models/About");
const Founder = require("../models/Founder");
const Journey = require("../models/Journey");
const Gurukul = require("../models/Gurukul");
const Activity = require("../models/Activity");
const Facility = require("../models/Facility");
const Event = require("../models/Event");
const Gallery = require("../models/Gallery");
const Video = require("../models/Video");
const AnnualReport = require("../models/AnnualReport");
const FuturePlan = require("../models/FuturePlan");
const Support = require("../models/Support");
const Contact = require("../models/Contact");
const ContactMessage = require("../models/ContactMessage");

const getDashboard = async (req, res) => {
    try {
        const [
            home,
            about,
            founder,
            journey,
            gurukul,
            activities,
            facilities,
            events,
            gallery,
            videos,
            annualReports,
            futurePlans,
            support,
            contact,
            contactMessages,
        ] = await Promise.all([
            Home.countDocuments(),
            About.countDocuments(),
            Founder.countDocuments(),
            Journey.countDocuments(),
            Gurukul.countDocuments(),
            Activity.countDocuments(),
            Facility.countDocuments(),
            Event.countDocuments(),
            Gallery.countDocuments(),
            Video.countDocuments(),
            AnnualReport.countDocuments(),
            FuturePlan.countDocuments(),
            Support.countDocuments(),
            Contact.countDocuments(),
            ContactMessage.countDocuments(),
        ]);

        const newMessages = await ContactMessage.countDocuments({
            $or: [{ status: "New" }, { isRead: false }, { read: false }]
        });

        res.status(200).json({
            success: true,
            stats: {
                messages: {
                    total: contactMessages,
                    unread: newMessages,
                },
                events,
                gallery,
                videos,
                annualReports,
                futurePlans,
                activities,
                facilities,
            },
            data: {
                content: {
                    home,
                    about,
                    founder,
                    journey,
                    gurukul,
                    activities,
                    facilities,
                    events,
                    gallery,
                    videos,
                    annualReports,
                    futurePlans,
                    support,
                    contact,
                },
                contactMessages: {
                    total: contactMessages,
                    new: newMessages,
                },
            },
        });
    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load dashboard",
        });
    }
};

module.exports = {
    getDashboard,
};