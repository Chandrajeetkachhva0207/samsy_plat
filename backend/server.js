const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, ".env"),
});

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const founderRoutes = require("./routes/founderRoutes");
const journeyRoutes = require("./routes/journeyRoutes");
const gurukulRoutes = require("./routes/gurukulRoutes");
const activityRoutes = require("./routes/activityRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const eventRoutes = require("./routes/eventRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const videoRoutes = require("./routes/videoRoutes");
const annualReportRoutes = require("./routes/annualReportRoutes");
const futurePlanRoutes = require("./routes/futurePlanRoutes");
const supportRoutes = require("./routes/supportRoutes");
const contactRoutes = require("./routes/contactRoutes");
const contactMessageRoutes = require("./routes/contactMessageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");

const app = express();

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// SECURITY
// =====================================================

app.use(
    helmet({
        // IMPORTANT:
        // Frontend runs on localhost:8081
        // Backend runs on localhost:5000
        // Uploaded gallery images must be allowed
        // to load from the frontend origin.
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);

// =====================================================
// CORS
// =====================================================

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

// =====================================================
// BODY PARSERS
// =====================================================

app.use(
    express.json({
        limit: "1mb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb",
    })
);

// =====================================================
// STATIC UPLOAD FILES
// =====================================================

// Uploaded images are physically stored at:
//
// backend/uploads/images/filename.jpg
//
// Browser URL:
//
// http://localhost:5000/uploads/images/filename.jpg

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads"),
        {
            // Allow frontend on localhost:8081
            // to display uploaded images.
            setHeaders: (res) => {
                res.setHeader(
                    "Access-Control-Allow-Origin",
                    "*"
                );

                res.setHeader(
                    "Cross-Origin-Resource-Policy",
                    "cross-origin"
                );
            },
        }
    )
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "Maa Narmada Spiritual Gurukul API is running",
    });
});

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

app.use("/api/home", homeRoutes);

app.use("/api/about", aboutRoutes);

app.use("/api/founder", founderRoutes);

app.use("/api/journey", journeyRoutes);

app.use("/api/gurukul", gurukulRoutes);

app.use("/api/activities", activityRoutes);

app.use("/api/facilities", facilityRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/gallery", galleryRoutes);

app.use("/api/videos", videoRoutes);

app.use("/api/annual-reports", annualReportRoutes);

app.use("/api/future-plans", futurePlanRoutes);

app.use("/api/support", supportRoutes);

app.use("/api/contact", contactRoutes);

app.use(
    "/api/contact-messages",
    contactMessageRoutes
);

app.use("/api/payment", paymentRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/students", studentRoutes);
app.use("/api/student", studentRoutes);

app.use("/api/admin/students", adminStudentRoutes);

// =====================================================
// 404 - API ROUTE NOT FOUND
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
        path: req.originalUrl,
    });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    console.error("Global error:", err);

    res.status(err.status || 500).json({
        success: false,
        message:
            err.message ||
            "Something went wrong on the server",
    });
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});