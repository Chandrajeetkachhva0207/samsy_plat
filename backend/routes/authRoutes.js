const express = require("express");

const {
    registerUser,
    loginUser,
    getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const {
    loginLimiter,
} = require("../middleware/rateLimitMiddleware");

const router = express.Router();


// =====================================================
// REGISTER
// =====================================================

router.post(
    "/register",
    registerUser
);


// =====================================================
// LOGIN
// =====================================================

router.post(
    "/login",
    loginLimiter,
    loginUser
);


// =====================================================
// CURRENT LOGGED-IN USER
// =====================================================

router.get(
    "/me",
    protect,
    getMe
);


module.exports = router;