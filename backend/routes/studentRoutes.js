const express = require("express");
const protect = require("../middleware/authMiddleware");
const studentUpload = require("../middleware/studentUploadMiddleware");

const {
    getMyProfile,
    updateMyProfile,
    uploadDocument,
    getMyFees,
    createFeeOrder,
    verifyFeePayment,
} = require("../controllers/studentController");

const router = express.Router();

// All student routes require authentication
router.use(protect);

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);
router.post("/upload-document", studentUpload.single("file"), uploadDocument);
router.get("/fees", getMyFees);
router.post("/fees/create-order", createFeeOrder);
router.post("/fees/verify-payment", verifyFeePayment);

module.exports = router;
