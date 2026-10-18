const express = require("express");

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPasswordWithOtp,
    getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const { loginLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login (email or mobile)
router.post("/login", loginLimiter, loginUser);

// Forgot Password OTP
router.post("/forgot-password", forgotPassword);

// Reset Password with OTP
router.post("/reset-password", resetPasswordWithOtp);

// Current Logged-in User
router.get("/me", protect, getMe);

module.exports = router;