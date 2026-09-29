// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // =====================================================
// // UPLOAD DIRECTORY
// // =====================================================

// const uploadDirectory = path.join(
//     __dirname,
//     "../uploads/images"
// );

// // Create directory automatically if it doesn't exist
// if (!fs.existsSync(uploadDirectory)) {
//     fs.mkdirSync(uploadDirectory, {
//         recursive: true,
//     });
// }

// // =====================================================
// // STORAGE
// // =====================================================

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDirectory);
//     },

//     filename: (req, file, cb) => {
//         const extension = path.extname(
//             file.originalname
//         ).toLowerCase();

//         const uniqueName =
//             Date.now() +
//             "-" +
//             Math.round(Math.random() * 1e9) +
//             extension;

//         cb(null, uniqueName);
//     },
// });

// // =====================================================
// // FILE FILTER
// // =====================================================

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/webp",
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(
//             new Error(
//                 "Only JPG, JPEG, PNG and WEBP images are allowed"
//             )
//         );
//     }
// };

// // =====================================================
// // MULTER CONFIGURATION
// // =====================================================

// const upload = multer({
//     storage,

//     fileFilter,

//     limits: {
//         fileSize: 5 * 1024 * 1024,
//     },
// });

// module.exports = upload;


const multer = require("multer");

// =====================================================
// MEMORY STORAGE
// =====================================================

// Gallery images are temporarily kept in memory.
// They will be uploaded to Cloudinary by the
// Gallery controller.

const storage = multer.memoryStorage();

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            )
        );
    }
};

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;