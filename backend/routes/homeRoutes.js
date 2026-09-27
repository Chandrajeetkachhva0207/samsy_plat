const express = require("express");

const {
    getHome,
    createHome,
    updateHome,
} = require("../controllers/homeController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// Public
router.get("/", getHome);


// Admin only
router.post("/", protect, adminOnly, createHome);

router.put("/", protect, adminOnly, updateHome);


module.exports = router;