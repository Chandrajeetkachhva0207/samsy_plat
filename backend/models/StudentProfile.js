const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        // Assigned by Admin upon verification (e.g. MNS-2026-001)
        studentId: {
            type: String,
            trim: true,
            default: "",
            index: true,
        },

        // Status: Incomplete -> Pending Verification -> Verified / Rejected
        status: {
            type: String,
            enum: ["Incomplete", "Pending Verification", "Verified", "Rejected"],
            default: "Incomplete",
            index: true,
        },

        adminNotes: {
            type: String,
            default: "",
        },

        // Personal Information
        personal: {
            fullName: { type: String, trim: true, default: "" },
            dob: { type: String, default: "" },
            gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
            bloodGroup: { type: String, default: "" },
            photo: { type: String, default: "" },
            mobile: { type: String, trim: true, default: "" },
            email: { type: String, trim: true, lowercase: true, default: "" },
            fullAddress: { type: String, default: "" },
            village: { type: String, default: "" },
            taluka: { type: String, default: "" },
            district: { type: String, default: "" },
            currentAddress: { type: String, default: "" },
            permanentAddress: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "Maharashtra" },
            pincode: { type: String, default: "" },
            parent: {
                parentName: { type: String, default: "" },
                fatherName: { type: String, default: "" },
                motherName: { type: String, default: "" },
                guardianName: { type: String, default: "" },
                parentMobile: { type: String, default: "" },
                altMobile: { type: String, default: "" },
                occupation: { type: String, default: "" },
                annualIncome: { type: String, default: "" },
            },
        },

        // Educational Information
        academic: {
            schoolName: { type: String, default: "" },
            schoolInfo: { type: String, default: "" },
            currentClass: { type: String, default: "" }, // e.g. 8th, 9th, 10th, Ved / Kirtan
            course: { type: String, default: "" }, // e.g. Gurukul Adhyatmik / Sangam
            admissionDate: { type: String, default: "" },
            previousSchool: { type: String, default: "" },
            previousMarksPercentage: { type: String, default: "" },
        },

        // Document Uploads (Paths or URLs for 8 specified documents)
        documents: {
            aadhaar: { type: String, default: "" }, // 1. Aadhaar Card
            panCard: { type: String, default: "" }, // 2. PAN Card
            birthCertificate: { type: String, default: "" }, // 3. Birth Certificate
            schoolDocuments: { type: String, default: "" }, // 4. School Documents
            leavingCertificate: { type: String, default: "" }, // 5. Leaving Certificate
            photo: { type: String, default: "" }, // 6. Student Photo
            parentDocuments: { type: String, default: "" }, // 7. Parent Documents
            otherCertificates: { type: String, default: "" }, // 8. Other Required Certificates
            previousSchoolMarksheet: { type: String, default: "" }, // backward compatibility
            other: { type: String, default: "" }, // backward compatibility
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
