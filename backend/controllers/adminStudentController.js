const StudentProfile = require("../models/StudentProfile");
const FeeRecord = require("../models/FeeRecord");
const User = require("../models/User");

// =====================================================
// GET ALL STUDENTS (With Search & Status Filter)
// =====================================================

const getAllStudents = async (req, res) => {
    try {
        const { search, status } = req.query;

        let query = {};

        if (status && status !== "ALL") {
            query.status = status;
        }

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            query.$or = [
                { "personal.fullName": regex },
                { "personal.mobile": regex },
                { "personal.email": regex },
                { studentId: regex },
                { "academic.schoolName": regex },
                { "academic.course": regex },
            ];
        }

        const students = await StudentProfile.find(query)
            .populate("user", "name email mobile createdAt")
            .sort({ createdAt: -1 });

        // Also fetch fee records map for quick summary in table
        const profileIds = students.map((s) => s._id);
        const feeRecords = await FeeRecord.find({
            studentProfile: { $in: profileIds },
        });

        const feeMap = {};
        feeRecords.forEach((f) => {
            feeMap[f.studentProfile.toString()] = {
                totalFees: f.totalFees,
                paidFees: f.paidFees,
                remainingFees: f.remainingFees,
                nextDueDate: f.nextDueDate,
                paymentsCount: f.payments?.length || 0,
            };
        });

        const results = students.map((s) => ({
            ...s.toObject(),
            fees: feeMap[s._id.toString()] || {
                totalFees: 0,
                paidFees: 0,
                remainingFees: 0,
                nextDueDate: "",
                paymentsCount: 0,
            },
        }));

        // Summary counts
        const totalCount = await StudentProfile.countDocuments({});
        const pendingCount = await StudentProfile.countDocuments({
            status: "Pending Verification",
        });
        const verifiedCount = await StudentProfile.countDocuments({
            status: "Verified",
        });
        const incompleteCount = await StudentProfile.countDocuments({
            status: "Incomplete",
        });

        return res.status(200).json({
            success: true,
            students: results,
            stats: {
                total: totalCount,
                pending: pendingCount,
                verified: verifiedCount,
                incomplete: incompleteCount,
            },
        });
    } catch (error) {
        console.error("Admin get students error:", error);
        return res.status(500).json({
            success: false,
            message: "विद्यार्थी यादी लोड करताना त्रुटी आली",
        });
    }
};

// =====================================================
// GET SINGLE STUDENT DETAILS (Profile + Fee Record)
// =====================================================

const getStudentDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await StudentProfile.findById(id).populate(
            "user",
            "name email mobile createdAt"
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "विद्यार्थी सापडला नाही",
            });
        }

        let feeRecord = await FeeRecord.findOne({
            studentProfile: profile._id,
        });

        if (!feeRecord) {
            feeRecord = await FeeRecord.create({
                user: profile.user._id,
                studentProfile: profile._id,
                studentId: profile.studentId || "",
                totalFees: 0,
                paidFees: 0,
                remainingFees: 0,
            });
        }

        return res.status(200).json({
            success: true,
            student: profile,
            fees: feeRecord,
        });
    } catch (error) {
        console.error("Admin get student details error:", error);
        return res.status(500).json({
            success: false,
            message: "विद्यार्थी तपशील मिळवताना त्रुटी आली",
        });
    }
};

// =====================================================
// VERIFY STUDENT / ASSIGN STUDENT ID / UPDATE STATUS
// =====================================================

const verifyStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, studentId, adminNotes } = req.body;

        const profile = await StudentProfile.findById(id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "विद्यार्थी सापडला नाही",
            });
        }

        if (status) profile.status = status;
        if (studentId !== undefined) {
            profile.studentId = studentId.trim();

            // Also update studentId in FeeRecord
            await FeeRecord.updateOne(
                { studentProfile: profile._id },
                { $set: { studentId: profile.studentId } }
            );
        }
        if (adminNotes !== undefined) profile.adminNotes = adminNotes;

        await profile.save();

        return res.status(200).json({
            success: true,
            message: "विद्यार्थी स्थिती व आयडी यशस्वीरीत्या अपडेट केली (Status updated)",
            student: profile,
        });
    } catch (error) {
        console.error("Admin verify student error:", error);
        return res.status(500).json({
            success: false,
            message: "पडताळणी अपडेट करताना त्रुटी आली",
        });
    }
};

// =====================================================
// UPDATE STUDENT PROFILE BY ADMIN
// =====================================================

const updateStudentByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { personal, academic, status, studentId } = req.body;

        const profile = await StudentProfile.findById(id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "विद्यार्थी सापडला नाही",
            });
        }

        if (personal) {
            profile.personal = { ...profile.personal.toObject(), ...personal };
        }
        if (academic) {
            profile.academic = { ...profile.academic.toObject(), ...academic };
        }
        if (status) profile.status = status;
        if (studentId !== undefined) profile.studentId = studentId;

        await profile.save();

        return res.status(200).json({
            success: true,
            message: "विद्यार्थी प्रोफाइल यशस्वीरीत्या अपडेट केली",
            student: profile,
        });
    } catch (error) {
        console.error("Admin update student error:", error);
        return res.status(500).json({
            success: false,
            message: "माहिती अपडेट करताना त्रुटी आली",
        });
    }
};

// =====================================================
// SET / UPDATE STUDENT FEES & SCHEDULE
// =====================================================

const setStudentFees = async (req, res) => {
    try {
        const { id } = req.params; // StudentProfile ID
        const { totalFees, academicYear, nextDueDate, feeScheduleNotes } = req.body;

        const profile = await StudentProfile.findById(id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "विद्यार्थी सापडला नाही",
            });
        }

        let feeRecord = await FeeRecord.findOne({ studentProfile: profile._id });
        if (!feeRecord) {
            feeRecord = new FeeRecord({
                user: profile.user,
                studentProfile: profile._id,
                studentId: profile.studentId || "",
            });
        }

        if (totalFees !== undefined) feeRecord.totalFees = Number(totalFees);
        if (academicYear) feeRecord.academicYear = academicYear;
        if (nextDueDate !== undefined) feeRecord.nextDueDate = nextDueDate;
        if (feeScheduleNotes !== undefined) feeRecord.feeScheduleNotes = feeScheduleNotes;

        await feeRecord.save();

        return res.status(200).json({
            success: true,
            message: "शुल्क रचना यशस्वीरीत्या सेव्ह केली (Fees updated)",
            fees: feeRecord,
        });
    } catch (error) {
        console.error("Admin set fees error:", error);
        return res.status(500).json({
            success: false,
            message: "शुल्क रचना अपडेट करताना त्रुटी आली",
        });
    }
};

// =====================================================
// RECORD FEE PAYMENT & AUTO GENERATE RECEIPT
// =====================================================

const recordFeePayment = async (req, res) => {
    try {
        const { id } = req.params; // StudentProfile ID
        const {
            amount,
            paymentMode,
            transactionRef,
            paymentDate,
            receivedBy,
            notes,
        } = req.body;

        const numAmount = Number(amount);
        if (!numAmount || numAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "कृपया वैध रक्कम टाका (Amount must be greater than 0)",
            });
        }

        const profile = await StudentProfile.findById(id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "विद्यार्थी सापडला नाही",
            });
        }

        let feeRecord = await FeeRecord.findOne({ studentProfile: profile._id });
        if (!feeRecord) {
            feeRecord = new FeeRecord({
                user: profile.user,
                studentProfile: profile._id,
                studentId: profile.studentId || "",
                totalFees: 0,
            });
        }

        // Auto generate unique receipt number: RCP-YEAR-NUMBER
        const year = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        const receiptNo = `RCP-${year}-${rand}`;

        const payment = {
            receiptNo,
            amount: numAmount,
            paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
            paymentMode: paymentMode || "Cash",
            transactionRef: transactionRef || "",
            receivedBy: receivedBy || "Office Admin",
            notes: notes || "",
            createdAt: new Date(),
        };

        feeRecord.payments.push(payment);
        await feeRecord.save();

        return res.status(201).json({
            success: true,
            message: "पेमेंट यशस्वीरीत्या नोंदवले व पावती तयार झाली (Payment recorded)",
            payment,
            fees: feeRecord,
        });
    } catch (error) {
        console.error("Admin record fee payment error:", error);
        return res.status(500).json({
            success: false,
            message: "पेमेंट नोंदवताना त्रुटी आली",
        });
    }
};

module.exports = {
    getAllStudents,
    getStudentDetails,
    verifyStudent,
    updateStudentByAdmin,
    setStudentFees,
    recordFeePayment,
};
