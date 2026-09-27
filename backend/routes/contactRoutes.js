
const express = require("express");

const {
    getContact,
    createContact,
    updateContact,
} = require("../controllers/contactController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Public
router.get("/", getContact);

// Admin
router.post("/", protect, adminOnly, createContact);

router.put("/", protect, adminOnly, updateContact);

module.exports = router;