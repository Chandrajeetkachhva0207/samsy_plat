const crypto = require("crypto");
const StudentProfile = require("../models/StudentProfile");
const FeeRecord = require("../models/FeeRecord");
const User = require("../models/User");
const { getRazorpayInstance } = require("../config/razorpay");

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

// =====================================================
// CREATE ONLINE PAYMENT ORDER (Razorpay)
// =====================================================

const createFeeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, installmentName } = req.body;
        const numAmount = Math.round(Number(amount));

        if (!numAmount || numAmount < 1) {
            return res.status(400).json({
                success: false,
                message: "किमान ₹१ रक्कम आवश्यक आहे (Valid amount required)",
            });
        }

        const feeRecord = await FeeRecord.findOne({ user: userId });
        if (!feeRecord) {
            return res.status(404).json({
                success: false,
                message: "शुल्क नोंद सापडली नाही",
            });
        }

        if (feeRecord.remainingFees <= 0) {
            return res.status(400).json({
                success: false,
                message: "आपली सर्व फी आधीच भरलेली आहे! (No pending fees)",
            });
        }

        if (numAmount > feeRecord.remainingFees) {
            return res.status(400).json({
                success: false,
                message: `रक्कम शिल्लक फी पेक्षा (₹${feeRecord.remainingFees}) जास्त असू शकत नाही`,
            });
        }

        const profile = await StudentProfile.findOne({ user: userId });
        const receiptId = `fee_${Date.now().toString().slice(-8)}`;
        const razorpay = getRazorpayInstance();

        let order;
        if (
            razorpay &&
            process.env.RAZORPAY_KEY_ID &&
            !process.env.RAZORPAY_KEY_ID.includes("placeholder")
        ) {
            order = await razorpay.orders.create({
                amount: numAmount * 100,
                currency: "INR",
                receipt: receiptId,
                notes: {
                    userId: String(userId),
                    studentId: profile?.studentId || "",
                    studentName: profile?.personal?.fullName || req.user.name || "",
                    installmentName: installmentName || "Student Fee Payment",
                },
            });
        } else {
            order = {
                id: `order_fee_${Date.now()}`,
                amount: numAmount * 100,
                currency: "INR",
                receipt: receiptId,
                status: "created",
            };
        }

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: numAmount,
            currency: "INR",
            key: process.env.RAZORPAY_KEY_ID || "rzp_test_Th2V6OKzKu078U",
            studentName: profile?.personal?.fullName || req.user.name || "",
            studentEmail: profile?.personal?.email || req.user.email || "",
            studentMobile: profile?.personal?.mobile || req.user.mobile || "",
        });
    } catch (error) {
        console.error("Create fee order error:", error);
        return res.status(500).json({
            success: false,
            message: "पेमेंट ऑर्डर तयार करताना त्रुटी आली",
        });
    }
};

// =====================================================
// VERIFY ONLINE PAYMENT & RECORD RECEIPT
// =====================================================

const verifyFeePayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount,
            installmentName,
        } = req.body;

        if (!razorpay_payment_id) {
            return res.status(400).json({
                success: false,
                message: "पेमेंट माहिती अपूर्ण आहे (Payment ID missing)",
            });
        }

        const feeRecord = await FeeRecord.findOne({ user: userId });
        if (!feeRecord) {
            return res.status(404).json({
                success: false,
                message: "शुल्क नोंद सापडली नाही",
            });
        }

        // Prevent duplicate payment entry
        const isDuplicate = feeRecord.payments.some(
            (p) => p.transactionRef === razorpay_payment_id
        );
        if (isDuplicate) {
            return res.status(200).json({
                success: true,
                message: "हे पेमेंट आधीच नोंदवले गेले आहे",
                fees: feeRecord,
            });
        }

        // Verify Razorpay HMAC signature if real order
        if (
            process.env.RAZORPAY_KEY_SECRET &&
            razorpay_order_id &&
            razorpay_signature &&
            !razorpay_order_id.startsWith("order_fee_")
        ) {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest("hex");

            if (expectedSignature !== razorpay_signature) {
                return res.status(400).json({
                    success: false,
                    message: "पेमेंट स्वाक्षरी पडताळणी अयशस्वी (Invalid payment signature)",
                });
            }
        }

        const numAmount = Number(amount);
        const year = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        const receiptNo = `RCP-${year}-${rand}`;

        const payment = {
            receiptNo,
            amount: numAmount,
            paymentDate: new Date(),
            paymentMode: "Online",
            transactionRef: razorpay_payment_id,
            installmentName: installmentName || `ऑनलाइन हप्ता ${feeRecord.payments.length + 1}`,
            receivedBy: "Razorpay Payment Gateway",
            notes: "Verified online student fee payment",
            createdAt: new Date(),
        };

        feeRecord.payments.push(payment);
        await feeRecord.save();

        return res.status(200).json({
            success: true,
            message: `पेमेंट यशस्वी झाले! अधिकृत पावती क्र: ${receiptNo}`,
            payment,
            fees: feeRecord,
        });
    } catch (error) {
        console.error("Verify fee payment error:", error);
        return res.status(500).json({
            success: false,
            message: "पेमेंट पडताळणी करताना त्रुटी आली",
        });
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    uploadDocument,
    getMyFees,
    createFeeOrder,
    verifyFeePayment,
};
