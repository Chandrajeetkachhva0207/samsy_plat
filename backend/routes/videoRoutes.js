const express = require("express");

const {
    getVideos,
    createVideo,
    updateVideo,
    deleteVideo,
} = require("../controllers/videoController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// Public
router.get("/", getVideos);


// Admin
router.post("/", protect, adminOnly, createVideo);

router.put("/:id", protect, adminOnly, updateVideo);

router.delete("/:id", protect, adminOnly, deleteVideo);


module.exports = router;