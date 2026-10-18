const StudentProfile = require("../models/StudentProfile");
const FeeRecord = require("../models/FeeRecord");
const User = require("../models/User");

// =====================================================
// GET ALL STUDENTS (With Search & Status Filter)
// =====================================================

const getAllStudents = async (req, res) => {
    try {
        const { search, status, course, paymentStatus, onlyPending } = req.query;

        let query = {};

        if (status && status !== "ALL") {
            query.status = status;
        }

        if (course && course !== "ALL") {
            query["academic.course"] = course;
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
                { "academic.currentClass": regex },
            ];
        }

        const students = await StudentProfile.find(query)
            .populate("user", "name email mobile createdAt")
            .sort({ createdAt: -1 });

        // Retrieve distinct courses for filter dropdown
        const distinctCourses = await StudentProfile.distinct("academic.course");
        const coursesList = distinctCourses.filter(Boolean);

        // Fetch fee records map
        const profileIds = students.map((s) => s._id);
        const feeRecords = await FeeRecord.find({
            studentProfile: { $in: profileIds },
        });

        const feeMap = {};
        feeRecords.forEach((f) => {
            const total = f.totalFees || 0;
            const paid = f.paidFees || 0;
            const remaining = f.remainingFees || 0;

            let computedStatus = "Unassigned";
            if (total > 0) {
                if (paid >= total) computedStatus = "Paid";
                else if (paid > 0) computedStatus = "Partially Paid";
                else computedStatus = "Pending";
            }

            const percentage = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;

            feeMap[f.studentProfile.toString()] = {
                _id: f._id,
                totalFees: total,
                paidFees: paid,
                remainingFees: remaining,
                academicYear: f.academicYear || "2025-2026",
                nextDueDate: f.nextDueDate || "",
                feeScheduleNotes: f.feeScheduleNotes || "",
                status: computedStatus,
                paymentPercentage: percentage,
                paymentsCount: f.payments?.length || 0,
                payments: f.payments || [],
                feeHistory: f.feeHistory || [],
            };
        });

        let results = students.map((s) => {
            const fees = feeMap[s._id.toString()] || {
                totalFees: 0,
                paidFees: 0,
                remainingFees: 0,
                academicYear: "2025-2026",
                nextDueDate: "",
                feeScheduleNotes: "",
                status: "Unassigned",
                paymentPercentage: 0,
                paymentsCount: 0,
                payments: [],
                feeHistory: [],
            };

            return {
                ...s.toObject(),
                fees,
            };
        });

        // Filter by paymentStatus if requested
        if (paymentStatus && paymentStatus !== "ALL") {
            results = results.filter((s) => s.fees.status === paymentStatus);
        }

        // Filter by onlyPending if requested
        if (onlyPending === "true" || onlyPending === true) {
            results = results.filter((s) => s.fees.remainingFees > 0);
        }

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

        // Overall Fee Financial Totals across the institute
        const allFees = await FeeRecord.find({});
        let instituteTotalFees = 0;
        let institutePaidFees = 0;
        let instituteRemainingFees = 0;
        let instituteReceipts = 0;
        let paidStudentsCount = 0;
        let partialStudentsCount = 0;
        let pendingStudentsCount = 0;

        allFees.forEach((f) => {
            const tot = f.totalFees || 0;
            const pd = f.paidFees || 0;
            const rem = f.remainingFees || 0;

            instituteTotalFees += tot;
            institutePaidFees += pd;
            instituteRemainingFees += rem;
            instituteReceipts += f.payments?.length || 0;

            if (tot > 0) {
                if (pd >= tot) paidStudentsCount++;
                else if (pd > 0) partialStudentsCount++;
                else pendingStudentsCount++;
            }
        });

        const collectionRate =
            instituteTotalFees > 0
                ? Math.round((institutePaidFees / instituteTotalFees) * 100)
                : 0;

        return res.status(200).json({
            success: true,
            students: results,
            courses: coursesList,
            stats: {
                total: totalCount,
                pending: pendingCount,
                verified: verifiedCount,
                incomplete: incompleteCount,
                totalFees: instituteTotalFees,
                totalPaid: institutePaidFees,
                totalRemaining: instituteRemainingFees,
                collectionPercentage: collectionRate,
                totalReceipts: instituteReceipts,
                paidStudents: paidStudentsCount,
                partialStudents: partialStudentsCount,
                pendingStudents: pendingStudentsCount,
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

        if (totalFees !== undefined) {
            const oldTotal = feeRecord.totalFees || 0;
            const newTotal = Math.max(0, Number(totalFees));
            if (oldTotal !== newTotal) {
                if (!feeRecord.feeHistory) feeRecord.feeHistory = [];
                feeRecord.feeHistory.push({
                    changedAt: new Date(),
                    changedBy: req.user?.name || "Admin",
                    oldTotal,
                    newTotal,
                    reason: feeScheduleNotes || "Course fee updated by admin",
                });
            }
            feeRecord.totalFees = newTotal;
        }

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
            installmentName,
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

        // Prevent duplicate transaction ID if supplied
        if (transactionRef && transactionRef.trim()) {
            const cleanRef = transactionRef.trim();
            const isDuplicate = feeRecord.payments.some(
                (p) =>
                    p.transactionRef &&
                    p.transactionRef.toLowerCase() === cleanRef.toLowerCase()
            );
            if (isDuplicate) {
                return res.status(409).json({
                    success: false,
                    message: `या Transaction ID (${cleanRef}) सह आधीच पेमेंट नोंदवले आहे (Duplicate Transaction ID)`,
                });
            }
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
            transactionRef: transactionRef ? transactionRef.trim() : "",
            installmentName:
                installmentName && installmentName.trim()
                    ? installmentName.trim()
                    : `हप्ता ${feeRecord.payments.length + 1}`,
            receivedBy: receivedBy || req.user?.name || "Office Admin",
            notes: notes || "",
            createdAt: new Date(),
        };

        feeRecord.payments.push(payment);
        await feeRecord.save();

        return res.status(201).json({
            success: true,
            message: `पेमेंट यशस्वीरीत्या नोंदवले व पावती तयार झाली: ${receiptNo}`,
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

// =====================================================
// DELETE / RESET STUDENT FEE STRUCTURE
// =====================================================

const deleteStudentFees = async (req, res) => {
    try {
        const { id } = req.params; // StudentProfile ID

        const profile = await StudentProfile.findById(id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "विद्यार्थी सापडला नाही",
            });
        }

        const feeRecord = await FeeRecord.findOne({ studentProfile: profile._id });
        if (!feeRecord) {
            return res.status(404).json({
                success: false,
                message: "शुल्क रचना सापडली नाही",
            });
        }

        const oldTotal = feeRecord.totalFees || 0;
        feeRecord.totalFees = 0;
        feeRecord.nextDueDate = null;
        feeRecord.feeScheduleNotes = "";

        if (!feeRecord.feeHistory) feeRecord.feeHistory = [];
        feeRecord.feeHistory.push({
            changedAt: new Date(),
            changedBy: req.user?.name || "Admin",
            oldTotal,
            newTotal: 0,
            reason: req.body?.reason || "फी रचना ॲडमिनने रीसेट/डिलीट केली",
        });

        await feeRecord.save();

        return res.status(200).json({
            success: true,
            message: "विद्यार्थ्याची फी रचना यशस्वीरीत्या रीसेट केली (Fee structure reset)",
            fees: feeRecord,
        });
    } catch (error) {
        console.error("Admin delete student fees error:", error);
        return res.status(500).json({
            success: false,
            message: "शुल्क रचना डिलीट करताना त्रुटी आली",
        });
    }
};

// =====================================================
// DELETE A SPECIFIC FEE PAYMENT INSTALLMENT
// =====================================================

const deleteFeePayment = async (req, res) => {
    try {
        const { id, paymentId } = req.params;

        const profile = await StudentProfile.findById(id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "विद्यार्थी सापडला नाही",
            });
        }

        const feeRecord = await FeeRecord.findOne({ studentProfile: profile._id });
        if (!feeRecord) {
            return res.status(404).json({
                success: false,
                message: "शुल्क नोंद सापडली नाही",
            });
        }

        const paymentIndex = feeRecord.payments.findIndex(
            (p) => String(p._id) === String(paymentId) || p.receiptNo === paymentId
        );

        if (paymentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "पेमेंट पावती सापडली नाही",
            });
        }

        const removedPayment = feeRecord.payments[paymentIndex];
        feeRecord.payments.splice(paymentIndex, 1);

        if (!feeRecord.feeHistory) feeRecord.feeHistory = [];
        feeRecord.feeHistory.push({
            changedAt: new Date(),
            changedBy: req.user?.name || "Admin",
            oldTotal: feeRecord.totalFees,
            newTotal: feeRecord.totalFees,
            reason: `पेमेंट डिलीट केले: पावती क्र. ${removedPayment.receiptNo} (रक्कम ₹${removedPayment.amount})`,
        });

        await feeRecord.save();

        return res.status(200).json({
            success: true,
            message: `पेमेंट पावती (${removedPayment.receiptNo}) यशस्वीरीत्या डिलीट केली`,
            fees: feeRecord,
        });
    } catch (error) {
        console.error("Admin delete fee payment error:", error);
        return res.status(500).json({
            success: false,
            message: "पेमेंट डिलीट करताना त्रुटी आली",
        });
    }
};

// =====================================================
// DELETE STUDENT PROFILE & FEES
// =====================================================

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const profile = await StudentProfile.findById(id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "विद्यार्थी सापडला नाही",
            });
        }

        await FeeRecord.deleteOne({ studentProfile: profile._id });
        if (profile.user) {
            await User.findByIdAndDelete(profile.user);
        }
        await StudentProfile.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "विद्यार्थी व संबंधित फी रेकॉर्ड यशस्वीरीत्या डिलीट केले",
        });
    } catch (error) {
        console.error("Admin delete student error:", error);
        return res.status(500).json({
            success: false,
            message: "विद्यार्थी डिलीट करताना त्रुटी आली",
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
    deleteStudentFees,
    deleteFeePayment,
    deleteStudent,
};

