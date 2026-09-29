const express = require("express");

const {
    getGallery,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
} = require("../controllers/galleryController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/galleryUploadMiddleware");

const router = express.Router();

/* =====================================================
   PUBLIC
===================================================== */

router.get("/", getGallery);


/* =====================================================
   ADMIN
===================================================== */

router.post(
    "/",
    protect,
    adminOnly,
    upload.single("image"),
    createGalleryItem
);


router.put(
    "/:id",
    protect,
    adminOnly,
    upload.single("image"),
    updateGalleryItem
);


router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteGalleryItem
);


module.exports = router;