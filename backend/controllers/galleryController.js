const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");

/* =====================================================
   GET LOCAL IMAGE FILE PATH
===================================================== */

const getImageFilePath = (imagePath) => {
    if (!imagePath || typeof imagePath !== "string") {
        return null;
    }

    // Only delete locally uploaded files
    if (!imagePath.startsWith("/uploads/")) {
        return null;
    }

    // Remove leading slash
    const cleanPath = imagePath.replace(/^\/+/, "");

    return path.join(
        __dirname,
        "..",
        cleanPath
    );
};


/* =====================================================
   DELETE IMAGE FILE
===================================================== */

const deleteImageFile = (imagePath) => {
    try {
        const filePath = getImageFilePath(imagePath);

        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);

            console.log("Deleted image:", filePath);
        }
    } catch (error) {
        console.error(
            "Error deleting image:",
            error.message
        );
    }
};


/* =====================================================
   GET ALL GALLERY ITEMS
===================================================== */

const getGallery = async (req, res) => {
    try {
        const gallery = await Gallery.find()
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            data: gallery,
        });
    } catch (error) {
        console.error(
            "Get gallery error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch gallery",
            error: error.message,
        });
    }
};


/* =====================================================
   GET SINGLE GALLERY ITEM
===================================================== */

const getGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findById(
            req.params.id
        ).lean();

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Gallery item not found",
            });
        }

        res.json({
            success: true,
            data: item,
        });
    } catch (error) {
        console.error(
            "Get gallery item error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch gallery item",
            error: error.message,
        });
    }
};


/* =====================================================
   CREATE GALLERY ITEM
===================================================== */

const createGalleryItem = async (req, res) => {
    try {
        const {
            title,
            category,
            description,
            caption,
            captionMr,
            captionEn,
            isActive,
            imageUrl,
        } = req.body;

        console.log("========== CREATE GALLERY ==========");
        console.log("Uploaded file:", req.file);
        console.log("Body:", req.body);

        let storedImage = "";

        /* ---------------------------------------------
           IMAGE UPLOAD
        --------------------------------------------- */

        if (req.file) {
            storedImage = `/uploads/images/${req.file.filename}`;

            console.log(
                "Saved gallery image:",
                storedImage
            );
        }

        /* ---------------------------------------------
           IMAGE URL
        --------------------------------------------- */

        else if (imageUrl) {
            storedImage = imageUrl;

            console.log(
                "Gallery image URL:",
                storedImage
            );
        }

        /* ---------------------------------------------
           IMAGE REQUIRED
        --------------------------------------------- */

        else {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        /* ---------------------------------------------
           CAPTION
        --------------------------------------------- */

        let finalCaption = caption || "";

        if (captionMr || captionEn) {
            finalCaption = {
                mr: captionMr || "",
                en: captionEn || captionMr || "",
            };
        }

        /* ---------------------------------------------
           CREATE DATABASE RECORD
        --------------------------------------------- */

        const galleryItem = await Gallery.create({
            title: title || "",

            category: category || "general",

            // Actual uploaded image path
            image: storedImage,

            // Keep same value for compatibility
            imageUrl: storedImage,

            caption: finalCaption,

            description: description || "",

            isActive:
                isActive === undefined
                    ? true
                    : isActive === "false"
                        ? false
                        : true,
        });

        console.log(
            "Gallery item created:",
            galleryItem._id,
            galleryItem.image
        );

        console.log("====================================");

        res.status(201).json({
            success: true,
            message: "Gallery item created successfully",
            data: galleryItem,
        });
    } catch (error) {
        console.error(
            "Create gallery error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to create gallery item",
            error: error.message,
        });
    }
};


/* =====================================================
   UPDATE GALLERY ITEM
===================================================== */

const updateGalleryItem = async (req, res) => {
    try {
        const galleryItem =
            await Gallery.findById(req.params.id);

        if (!galleryItem) {
            return res.status(404).json({
                success: false,
                message: "Gallery item not found",
            });
        }

        const {
            title,
            category,
            description,
            caption,
            captionMr,
            captionEn,
            isActive,
            imageUrl,
        } = req.body;

        /* ---------------------------------------------
           BASIC FIELDS
        --------------------------------------------- */

        if (title !== undefined) {
            galleryItem.title = title;
        }

        if (category !== undefined) {
            galleryItem.category = category;
        }

        if (description !== undefined) {
            galleryItem.description = description;
        }

        if (isActive !== undefined) {
            galleryItem.isActive =
                isActive === "false"
                    ? false
                    : true;
        }

        /* ---------------------------------------------
           CAPTION
        --------------------------------------------- */

        if (
            captionMr !== undefined ||
            captionEn !== undefined
        ) {
            galleryItem.caption = {
                mr: captionMr || "",
                en:
                    captionEn ||
                    captionMr ||
                    "",
            };
        } else if (
            caption !== undefined
        ) {
            galleryItem.caption = caption;
        }

        /* ---------------------------------------------
           NEW IMAGE UPLOAD
        --------------------------------------------- */

        if (req.file) {
            const oldImage =
                galleryItem.image ||
                galleryItem.imageUrl;

            deleteImageFile(oldImage);

            const newImage =
                `/uploads/images/${req.file.filename}`;

            galleryItem.image = newImage;
            galleryItem.imageUrl = newImage;

            console.log(
                "Updated gallery image:",
                newImage
            );
        }

        /* ---------------------------------------------
           IMAGE URL
        --------------------------------------------- */

        else if (imageUrl) {
            const oldImage =
                galleryItem.image ||
                galleryItem.imageUrl;

            if (oldImage !== imageUrl) {
                deleteImageFile(oldImage);
            }

            galleryItem.image = imageUrl;
            galleryItem.imageUrl = imageUrl;
        }

        /* ---------------------------------------------
           SAVE
        --------------------------------------------- */

        await galleryItem.save();

        res.json({
            success: true,
            message: "Gallery item updated successfully",
            data: galleryItem,
        });
    } catch (error) {
        console.error(
            "Update gallery error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update gallery item",
            error: error.message,
        });
    }
};


/* =====================================================
   DELETE GALLERY ITEM
===================================================== */

const deleteGalleryItem = async (req, res) => {
    try {
        const galleryItem =
            await Gallery.findById(req.params.id);

        if (!galleryItem) {
            return res.status(404).json({
                success: false,
                message: "Gallery item not found",
            });
        }

        const imagePath =
            galleryItem.image ||
            galleryItem.imageUrl;

        deleteImageFile(imagePath);

        await Gallery.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success: true,
            message: "Gallery item deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete gallery error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete gallery item",
            error: error.message,
        });
    }
};


/* =====================================================
   EXPORTS
===================================================== */

module.exports = {
    getGallery,
    getGalleryItem,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
};