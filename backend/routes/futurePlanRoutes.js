const express = require("express");

const {
    getFuturePlans,
    createFuturePlan,
    updateFuturePlan,
    deleteFuturePlan,
} = require("../controllers/futurePlanController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// Public
router.get("/", getFuturePlans);


// Admin
router.post("/", protect, adminOnly, createFuturePlan);

router.put("/:id", protect, adminOnly, updateFuturePlan);

router.delete("/:id", protect, adminOnly, deleteFuturePlan);


module.exports = router;