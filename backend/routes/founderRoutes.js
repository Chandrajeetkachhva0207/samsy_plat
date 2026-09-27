const express = require("express");

const {
    getFounder,
    createFounder,
    updateFounder,
} = require("../controllers/founderController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// Public
router.get("/", getFounder);


// Admin only
router.post("/", protect, adminOnly, createFounder);

router.put("/", protect, adminOnly, updateFounder);


module.exports = router;