const multer = require("multer");

// =====================================================
// MEMORY STORAGE
// =====================================================

const storage = multer.memoryStorage();

// =====================================================
// VIDEO FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only video files are allowed"
            )
        );
    }
};

// =====================================================
// MULTER CONFIGURATION
// =====================================================
//
// Cloudinary Free supports video files up to 100 MB.
// =====================================================

const upload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize: 100 * 1024 * 1024,
    },
});

module.exports = upload;