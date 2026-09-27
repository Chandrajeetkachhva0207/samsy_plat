const express = require("express");

const {
    getAbout,
    createAbout,
    updateAbout,
} = require("../controllers/aboutController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// Public
router.get("/", getAbout);


// Admin only
router.post("/", protect, adminOnly, createAbout);

router.put("/", protect, adminOnly, updateAbout);


module.exports = router;