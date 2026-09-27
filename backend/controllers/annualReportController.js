

const mongoose = require("mongoose");
const AnnualReport = require("../models/AnnualReport");
const cloudinary = require("../config/cloudinary");

// =====================================================
// CLOUDINARY PDF UPLOAD HELPER
// =====================================================

const uploadPDFToCloudinary = (buffer, originalName) => {
    return new Promise((resolve, reject) => {
        const publicId =
    `${Date.now()}-${Math.round(
        Math.random() * 1e9
    )}`;
        // const publicId =
        //     `annual-reports/${Date.now()}-${Math.round(
        //         Math.random() * 1e9
        //     )}`;

        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                    public_id: publicId,
                    format: "pdf",
                    folder: "annual-reports",
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                }
            );

        uploadStream.end(buffer);
    });
};


// =====================================================
// CLOUDINARY PDF DELETE HELPER
// =====================================================

const deletePDFFromCloudinary = async (pdfUrl) => {
    try {
        if (!pdfUrl) {
            return;
        }

        // Only delete Cloudinary URLs
        if (!pdfUrl.includes("res.cloudinary.com")) {
            return;
        }

        const url = new URL(pdfUrl);

        const parts = url.pathname.split("/");

        // Find "upload" in the Cloudinary URL
        const uploadIndex = parts.indexOf("upload");

        if (uploadIndex === -1) {
            return;
        }

        let publicIdParts =
            parts.slice(uploadIndex + 1);

        // Remove version: v1234567890
        if (
            publicIdParts[0] &&
            publicIdParts[0].startsWith("v")
        ) {
            publicIdParts.shift();
        }

        let publicId =
            publicIdParts.join("/");

        // Remove .pdf extension
        publicId =
            publicId.replace(/\.pdf$/i, "");

        await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "image",
            }
        );

    } catch (error) {
        console.error(
            "Cloudinary PDF delete error:",
            error
        );
    }
};


// =====================================================
// GET ALL REPORTS
// =====================================================

const getReports = async (req, res) => {
    try {
        const reports = await AnnualReport.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });

    } catch (error) {
        console.error(
            "Get annual reports error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch annual reports",
        });
    }
};


// =====================================================
// CREATE REPORT
// =====================================================

const createReport = async (req, res) => {
    try {
        const {
            titleMr,
            titleEn,
            yearMr,
            yearEn,
            descriptionMr,
            descriptionEn,
            isActive,
        } = req.body;


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (
            !titleMr ||
            !titleEn ||
            !yearMr ||
            !yearEn
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Marathi and English title and year are required",
            });
        }


        // -------------------------------------------------
        // PDF CHECK
        // -------------------------------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "PDF file is required",
            });
        }


        // -------------------------------------------------
        // UPLOAD PDF TO CLOUDINARY
        // -------------------------------------------------

        const uploadResult =
            await uploadPDFToCloudinary(
                req.file.buffer,
                req.file.originalname
            );

        const pdfUrl =
            uploadResult.secure_url;


        // -------------------------------------------------
        // CREATE REPORT
        // -------------------------------------------------

        const report = await AnnualReport.create({
            title: {
                mr: titleMr,
                en: titleEn,
            },

            year: {
                mr: yearMr,
                en: yearEn,
            },

            description: {
                mr: descriptionMr || "",
                en: descriptionEn || "",
            },

            pdf: pdfUrl,

            isActive:
                isActive === undefined
                    ? true
                    : isActive === "true" ||
                      isActive === true,
        });


        return res.status(201).json({
            success: true,
            message:
                "Annual report added successfully",
            data: report,
        });

    } catch (error) {
        console.error(
            "Create annual report error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to create annual report",
        });
    }
};


// =====================================================
// UPDATE REPORT
// =====================================================

const updateReport = async (req, res) => {
    try {
        const { id } = req.params;


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }


        const existingReport =
            await AnnualReport.findById(id);


        if (!existingReport) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }


        const {
            titleMr,
            titleEn,
            yearMr,
            yearEn,
            descriptionMr,
            descriptionEn,
            isActive,
        } = req.body;


        const updateData = {};


        // -------------------------------------------------
        // TITLE
        // -------------------------------------------------

        if (titleMr || titleEn) {
            updateData.title = {
                mr:
                    titleMr ||
                    existingReport.title?.mr ||
                    existingReport.title ||
                    "",

                en:
                    titleEn ||
                    existingReport.title?.en ||
                    "",
            };
        }


        // -------------------------------------------------
        // YEAR
        // -------------------------------------------------

        if (yearMr || yearEn) {
            updateData.year = {
                mr:
                    yearMr ||
                    existingReport.year?.mr ||
                    existingReport.year ||
                    "",

                en:
                    yearEn ||
                    existingReport.year?.en ||
                    "",
            };
        }


        // -------------------------------------------------
        // DESCRIPTION
        // -------------------------------------------------

        if (
            descriptionMr !== undefined ||
            descriptionEn !== undefined
        ) {
            updateData.description = {
                mr:
                    descriptionMr !== undefined
                        ? descriptionMr
                        : existingReport.description?.mr ||
                          "",

                en:
                    descriptionEn !== undefined
                        ? descriptionEn
                        : existingReport.description?.en ||
                          "",
            };
        }


        // -------------------------------------------------
        // ACTIVE STATUS
        // -------------------------------------------------

        if (isActive !== undefined) {
            updateData.isActive =
                isActive === "true" ||
                isActive === true;
        }


        // -------------------------------------------------
        // NEW PDF
        // -------------------------------------------------

        if (req.file) {

            const uploadResult =
                await uploadPDFToCloudinary(
                    req.file.buffer,
                    req.file.originalname
                );

            updateData.pdf =
                uploadResult.secure_url;

            // Delete old Cloudinary PDF
            await deletePDFFromCloudinary(
                existingReport.pdf
            );
        }


        // -------------------------------------------------
        // UPDATE DATABASE
        // -------------------------------------------------

        const report =
            await AnnualReport.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );


        return res.status(200).json({
            success: true,
            message:
                "Annual report updated successfully",
            data: report,
        });

    } catch (error) {
        console.error(
            "Update annual report error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update annual report",
        });
    }
};


// =====================================================
// DELETE REPORT
// =====================================================

const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID",
            });
        }


        const report =
            await AnnualReport.findById(id);


        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }


        // -------------------------------------------------
        // DELETE PDF FROM CLOUDINARY
        // -------------------------------------------------

        await deletePDFFromCloudinary(
            report.pdf
        );


        // -------------------------------------------------
        // DELETE DATABASE RECORD
        // -------------------------------------------------

        await AnnualReport.findByIdAndDelete(id);


        return res.status(200).json({
            success: true,
            message:
                "Annual report deleted successfully",
        });

    } catch (error) {
        console.error(
            "Delete annual report error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to delete annual report",
        });
    }
};


module.exports = {
    getReports,
    createReport,
    updateReport,
    deleteReport,
};

