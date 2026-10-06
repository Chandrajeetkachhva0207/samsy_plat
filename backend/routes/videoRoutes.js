const express = require("express");

const {
    getVideos,
    createVideo,
    updateVideo,
    deleteVideo,
} = require("../controllers/videoController");

const protect = require("../middleware/authMiddleware");

const adminOnly = require("../middleware/adminMiddleware");

const videoUpload = require(
    "../middleware/videoUploadMiddleware"
);

const router = express.Router();


// =====================================================
// PUBLIC
// =====================================================

router.get(
    "/",
    getVideos
);


// =====================================================
// ADMIN
// =====================================================

router.post(
    "/",
    protect,
    adminOnly,
    videoUpload.single("video"),
    createVideo
);


router.put(
    "/:id",
    protect,
    adminOnly,
    updateVideo
);


router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteVideo
);


module.exports = router;