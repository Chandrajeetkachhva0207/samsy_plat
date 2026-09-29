const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");

// =====================================================
// UPLOAD IMAGE TO CLOUDINARY
// =====================================================

const uploadImageToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "maa-narmada/gallery",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

        uploadStream.end(buffer);
    });
};

// =====================================================
// DELETE IMAGE FROM CLOUDINARY
// =====================================================

const deleteCloudinaryImage = async (publicId) => {
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "image",
            }
        );

        console.log(
            "Deleted Cloudinary image:",
            publicId
        );
    } catch (error) {
        console.error(
            "Cloudinary delete error:",
            error.message
        );
    }
};

// =====================================================
// GET ALL GALLERY ITEMS
// =====================================================

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

// =====================================================
// GET SINGLE GALLERY ITEM
// =====================================================

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

// =====================================================
// CREATE GALLERY ITEM
// =====================================================

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

        console.log(
            "========== CREATE GALLERY =========="
        );

        console.log(
            "Uploaded file:",
            req.file
        );

        console.log(
            "Body:",
            req.body
        );

        let storedImage = "";
        let cloudinaryPublicId = "";

        // =====================================================
        // UPLOAD IMAGE TO CLOUDINARY
        // =====================================================

        if (req.file) {
            const result =
                await uploadImageToCloudinary(
                    req.file.buffer
                );

            storedImage =
                result.secure_url;

            cloudinaryPublicId =
                result.public_id;

            console.log(
                "Cloudinary image URL:",
                storedImage
            );

            console.log(
                "Cloudinary public ID:",
                cloudinaryPublicId
            );
        }

        // =====================================================
        // IMAGE URL
        // =====================================================

        else if (imageUrl) {
            storedImage = imageUrl;

            console.log(
                "Gallery image URL:",
                storedImage
            );
        }

        // =====================================================
        // IMAGE REQUIRED
        // =====================================================

        else {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        // =====================================================
        // CAPTION
        // =====================================================

        let finalCaption =
            caption || "";

        if (
            captionMr ||
            captionEn
        ) {
            finalCaption = {
                mr: captionMr || "",
                en:
                    captionEn ||
                    captionMr ||
                    "",
            };
        }

        // =====================================================
        // CREATE DATABASE RECORD
        // =====================================================

        const galleryItem =
            await Gallery.create({
                title: title || "",

                category:
                    category ||
                    "general",

                image:
                    storedImage,

                imageUrl:
                    storedImage,

                caption:
                    finalCaption,

                description:
                    description || "",

                isActive:
                    isActive === undefined
                        ? true
                        : isActive === "false"
                            ? false
                            : true,

                cloudinaryPublicId:
                    cloudinaryPublicId ||
                    "",
            });

        console.log(
            "Gallery item created:",
            galleryItem._id,
            galleryItem.image
        );

        console.log(
            "===================================="
        );

        res.status(201).json({
            success: true,
            message:
                "Gallery item created successfully",
            data: galleryItem,
        });
    } catch (error) {
        console.error(
            "Create gallery error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to create gallery item",
            error: error.message,
        });
    }
};

// =====================================================
// UPDATE GALLERY ITEM
// =====================================================

const updateGalleryItem = async (req, res) => {
    try {
        const galleryItem =
            await Gallery.findById(
                req.params.id
            );

        if (!galleryItem) {
            return res.status(404).json({
                success: false,
                message:
                    "Gallery item not found",
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

        // =====================================================
        // BASIC FIELDS
        // =====================================================

        if (title !== undefined) {
            galleryItem.title = title;
        }

        if (category !== undefined) {
            galleryItem.category =
                category;
        }

        if (
            description !== undefined
        ) {
            galleryItem.description =
                description;
        }

        if (
            isActive !== undefined
        ) {
            galleryItem.isActive =
                isActive === "false"
                    ? false
                    : true;
        }

        // =====================================================
        // CAPTION
        // =====================================================

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
            galleryItem.caption =
                caption;
        }

        // =====================================================
        // NEW IMAGE UPLOAD
        // =====================================================

        if (req.file) {
            // Delete old Cloudinary image
            if (
                galleryItem.cloudinaryPublicId
            ) {
                await deleteCloudinaryImage(
                    galleryItem.cloudinaryPublicId
                );
            }

            // Upload new image
            const result =
                await uploadImageToCloudinary(
                    req.file.buffer
                );

            const newImage =
                result.secure_url;

            galleryItem.image =
                newImage;

            galleryItem.imageUrl =
                newImage;

            galleryItem.cloudinaryPublicId =
                result.public_id;

            console.log(
                "Updated gallery image:",
                newImage
            );
        }

        // =====================================================
        // IMAGE URL
        // =====================================================

        else if (imageUrl) {
            galleryItem.image =
                imageUrl;

            galleryItem.imageUrl =
                imageUrl;

            // If replacing Cloudinary image
            // with an external URL, delete old one
            if (
                galleryItem.cloudinaryPublicId
            ) {
                await deleteCloudinaryImage(
                    galleryItem.cloudinaryPublicId
                );

                galleryItem.cloudinaryPublicId =
                    "";
            }
        }

        // =====================================================
        // SAVE
        // =====================================================

        await galleryItem.save();

        res.json({
            success: true,
            message:
                "Gallery item updated successfully",
            data: galleryItem,
        });
    } catch (error) {
        console.error(
            "Update gallery error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update gallery item",
            error: error.message,
        });
    }
};

// =====================================================
// DELETE GALLERY ITEM
// =====================================================

const deleteGalleryItem = async (
    req,
    res
) => {
    try {
        const galleryItem =
            await Gallery.findById(
                req.params.id
            );

        if (!galleryItem) {
            return res.status(404).json({
                success: false,
                message:
                    "Gallery item not found",
            });
        }

        // =====================================================
        // DELETE CLOUDINARY IMAGE
        // =====================================================

        if (
            galleryItem.cloudinaryPublicId
        ) {
            await deleteCloudinaryImage(
                galleryItem.cloudinaryPublicId
            );
        }

        // =====================================================
        // DELETE DATABASE RECORD
        // =====================================================

        await Gallery.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success: true,
            message:
                "Gallery item deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete gallery error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete gallery item",
            error: error.message,
        });
    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    getGallery,
    getGalleryItem,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
};