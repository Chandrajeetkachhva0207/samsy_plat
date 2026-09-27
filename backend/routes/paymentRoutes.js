const express = require("express");
const {
    getRazorpayKey,
    createOrder,
    verifyPayment,
    getDonations,
    recordReceipt,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Public routes
router.get("/key", getRazorpayKey);
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/record-receipt", recordReceipt);

// Admin-only route
router.get("/donations", protect, adminOnly, getDonations);

module.exports = router;

