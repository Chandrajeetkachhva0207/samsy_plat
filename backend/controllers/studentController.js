const StudentProfile = require("../models/StudentProfile");
const FeeRecord = require("../models/FeeRecord");
const User = require("../models/User");

// =====================================================
// GET CURRENT LOGGED-IN STUDENT PROFILE & FEES
// =====================================================

const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find or auto-create student profile
        let profile = await StudentProfile.findOne({ user: userId });
        if (!profile) {
            const user = await User.findById(userId);
            profile = await StudentProfile.create({
                user: userId,
                status: "Incomplete",
                personal: {
                    fullName: user ? user.name : "",
                    email: user ? user.email : "",
                    mobile: user ? user.mobile : "",
                },
            });
        }

        // Find or auto-create fee record
        let fees = await FeeRecord.findOne({ user: userId });
        if (!fees) {
            fees = await FeeRecord.create({
                user: userId,
                studentProfile: profile._id,
                studentId: profile.studentId || "",
                totalFees: 0,
                paidFees: 0,
                remainingFees: 0,
            });
        }

        return res.status(200).json({
            success: true,
            profile,
            fees: {
                studentId: fees.studentId || profile.studentId || "",
                academicYear: fees.academicYear,
                totalFees: fees.totalFees,
                paidFees: fees.paidFees,
                remainingFees: fees.remainingFees,
                nextDueDate: fees.nextDueDate,
                feeScheduleNotes: fees.feeScheduleNotes,
                payments: fees.payments || [],
            },
        });
    } catch (error) {
        console.error("Error fetching student profile:", error);
        return res.status(500).json({
            success: false,
            message: "विद्यार्थी माहिती लोड करताना त्रुटी आली",
        });
    }
};

// =====================================================
// UPDATE STUDENT PROFILE (Personal + Academic)
// =====================================================

const updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { personal, academic, submitForVerification } = req.body;

        let profile = await StudentProfile.findOne({ user: userId });
        if (!profile) {
            profile = new StudentProfile({ user: userId });
        }

        if (personal) {
            profile.personal = {
                ...profile.personal.toObject(),
                ...personal,
            };
        }

        if (academic) {
            profile.academic = {
                ...profile.academic.toObject(),
                ...academic,
            };
        }

        // If student submitted form or requested verification
        if (submitForVerification) {
            if (profile.status === "Incomplete" || !profile.status) {
                profile.status = "Pending Verification";
            }
        }

        await profile.save();

        return res.status(200).json({
            success: true,
            message: submitForVerification
                ? "माहिती जतन केली असून पडताळणीसाठी पाठवली आहे (Submitted for verification)"
                : "माहिती यशस्वीरीत्या जतन केली (Profile updated)",
            profile,
        });
    } catch (error) {
        console.error("Error updating student profile:", error);
        return res.status(500).json({
            success: false,
            message: "माहिती जतन करताना त्रुटी आली",
        });
    }
};

// =====================================================
// UPLOAD STUDENT DOCUMENT / PHOTO
// =====================================================

const uploadDocument = async (req, res) => {
    try {
        const userId = req.user.id;
        const { docType } = req.body; // e.g. "aadhaar", "birthCertificate", "previousSchoolMarksheet", "leavingCertificate", "photo", "other"

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "कृपया फाईल निवडा (File is required)",
            });
        }

        const validTypes = [
            "aadhaar",
            "panCard",
            "birthCertificate",
            "schoolDocuments",
            "leavingCertificate",
            "photo",
            "parentDocuments",
            "otherCertificates",
            "previousSchoolMarksheet",
            "other",
        ];

        const targetType = validTypes.includes(docType) ? docType : "other";

        // File path relative to server root
        const fileUrl = `/uploads/students/${req.file.filename}`;

        let profile = await StudentProfile.findOne({ user: userId });
        if (!profile) {
            profile = new StudentProfile({ user: userId });
        }

        if (!profile.documents) {
            profile.documents = {};
        }

        profile.documents[targetType] = fileUrl;

        // If photo, also update personal.photo
        if (targetType === "photo") {
            if (!profile.personal) profile.personal = {};
            profile.personal.photo = fileUrl;
        }

        // If user has uploaded any key doc, move out of incomplete if appropriate
        if (profile.status === "Incomplete" && (profile.documents.aadhaar || profile.documents.birthCertificate)) {
            profile.status = "Pending Verification";
        }

        await profile.save();

        return res.status(200).json({
            success: true,
            message: "कागदपत्र यशस्वीरीत्या अपलोड झाले (Document uploaded)",
            fileUrl,
            docType: targetType,
            profile,
        });
    } catch (error) {
        console.error("Error uploading student document:", error);
        return res.status(500).json({
            success: false,
            message: "कागदपत्र अपलोड करताना त्रुटी आली",
        });
    }
};

// =====================================================
// GET STUDENT FEES & RECEIPTS
// =====================================================

const getMyFees = async (req, res) => {
    try {
        const userId = req.user.id;
        let fees = await FeeRecord.findOne({ user: userId });
        let profile = await StudentProfile.findOne({ user: userId });

        if (!fees) {
            fees = await FeeRecord.create({
                user: userId,
                studentProfile: profile ? profile._id : null,
                studentId: profile ? profile.studentId : "",
                totalFees: 0,
                paidFees: 0,
                remainingFees: 0,
            });
        }

        return res.status(200).json({
            success: true,
            fees,
            studentInfo: {
                studentId: profile ? profile.studentId : "",
                fullName: profile?.personal?.fullName || "",
                status: profile ? profile.status : "Incomplete",
            },
        });
    } catch (error) {
        console.error("Error fetching fees:", error);
        return res.status(500).json({
            success: false,
            message: "शुल्क माहिती लोड करताना त्रुटी आली",
        });
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    uploadDocument,
    getMyFees,
};
