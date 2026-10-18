const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "../uploads/students");

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
        const uniqueName = `student_${Date.now()}_${Math.round(Math.random() * 1e6)}_${safeBase}${ext}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf",
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, WEBP and PDF files are allowed"));
    }
};

const studentUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});

module.exports = studentUpload;
