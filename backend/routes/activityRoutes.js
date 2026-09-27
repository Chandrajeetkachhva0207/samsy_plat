const express = require("express");

const {
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity,
} = require("../controllers/activityController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// Public
router.get("/", getActivities);


// Admin
router.post("/", protect, adminOnly, createActivity);

router.put("/:id", protect, adminOnly, updateActivity);

router.delete("/:id", protect, adminOnly, deleteActivity);


module.exports = router;