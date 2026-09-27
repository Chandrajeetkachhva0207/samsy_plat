const express = require("express");

const {
    getReports,
    createReport,
    updateReport,
    deleteReport,
} = require("../controllers/annualReportController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const uploadPDF = require("../middleware/pdfUploadMiddleware");

const router = express.Router();


// Public
router.get("/", getReports);


// Admin
router.post(
    "/",
    protect,
    adminOnly,
    uploadPDF.single("pdf"),
    createReport
);

router.put(
    "/:id",
    protect,
    adminOnly,
    uploadPDF.single("pdf"),
    updateReport
);

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteReport
);


module.exports = router;