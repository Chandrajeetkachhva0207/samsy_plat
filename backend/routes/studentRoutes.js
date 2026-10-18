const express = require("express");
const protect = require("../middleware/authMiddleware");
const studentUpload = require("../middleware/studentUploadMiddleware");

const {
    getMyProfile,
    updateMyProfile,
    uploadDocument,
    getMyFees,
} = require("../controllers/studentController");

const router = express.Router();

// All student routes require authentication
router.use(protect);

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);
router.post("/upload-document", studentUpload.single("file"), uploadDocument);
router.get("/fees", getMyFees);

module.exports = router;
