const express = require("express");

const {
    getFacilities,
    createFacility,
    updateFacility,
    deleteFacility,
} = require("../controllers/facilityController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// Public
router.get("/", getFacilities);


// Admin
router.post("/", protect, adminOnly, createFacility);

router.put("/:id", protect, adminOnly, updateFacility);

router.delete("/:id", protect, adminOnly, deleteFacility);


module.exports = router;