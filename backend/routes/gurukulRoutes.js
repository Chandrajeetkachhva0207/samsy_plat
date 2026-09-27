const express = require("express");

const {
    getGurukul,
    createGurukul,
    updateGurukul,
} = require("../controllers/gurukulController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// Public
router.get("/", getGurukul);


// Admin only
router.post("/", protect, adminOnly, createGurukul);

router.put("/", protect, adminOnly, updateGurukul);


module.exports = router;