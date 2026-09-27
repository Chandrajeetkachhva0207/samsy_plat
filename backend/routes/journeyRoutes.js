const express = require("express");

const {
    getJourneys,
    createJourney,
    updateJourney,
    deleteJourney,
} = require("../controllers/journeyController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// Public
router.get("/", getJourneys);


// Admin only
router.post("/", protect, adminOnly, createJourney);

router.put("/:id", protect, adminOnly, updateJourney);

router.delete("/:id", protect, adminOnly, deleteJourney);


module.exports = router;