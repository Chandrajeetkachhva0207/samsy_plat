const express = require("express");

const {
    getSupport,
    createSupport,
    updateSupport,
} = require("../controllers/supportController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Public
router.get("/", getSupport);

// Admin
router.post("/", protect, adminOnly, createSupport);
router.put("/", protect, adminOnly, updateSupport);

module.exports = router;