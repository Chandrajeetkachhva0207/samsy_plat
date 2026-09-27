const mongoose = require("mongoose");
const AnnualReport = require("../models/AnnualReport");
const fs = require("fs");
const path = require("path");


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
        // PDF PATH
        // -------------------------------------------------

        const pdfPath =
            `/uploads/reports/${req.file.filename}`;


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

            pdf: pdfPath,

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
            updateData.pdf =
                `/uploads/reports/${req.file.filename}`;
        }


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
            await AnnualReport.findByIdAndDelete(id);


        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }


        // -------------------------------------------------
        // DELETE PDF FILE
        // -------------------------------------------------

        if (report.pdf) {
            const cleanPath =
                report.pdf.replace(/^\/+/, "");

            const filePath = path.join(
                __dirname,
                "..",
                cleanPath
            );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }


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


