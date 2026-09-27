const crypto = require("crypto");
const Donation = require("../models/Donation");
const { getRazorpayInstance } = require("../config/razorpay");

// GET /api/payment/key
// Returns public key ID for frontend Razorpay checkout
const getRazorpayKey = async (req, res) => {
    try {
        const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key";
        return res.status(200).json({
            success: true,
            key: keyId,
            isTestMode: keyId.startsWith("rzp_test"),
            paymentPageUrl: process.env.RAZORPAY_PAYMENT_PAGE_URL || "",
        });
    } catch (error) {
        console.error("Get Razorpay key error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve payment configuration",
        });
    }
};

// POST /api/payment/create-order
// Creates a Razorpay order and saves a pending donation record
const createOrder = async (req, res) => {
    try {
        const {
            amount,
            donorName,
            email,
            phone,
            panNumber,
            profession,
            donationType,
            address,
            notes,
        } = req.body;

        if (!amount || Number(amount) < 1) {
            return res.status(400).json({
                success: false,
                message: "A valid donation amount (minimum ₹1) is required",
            });
        }

        const resolvedDonorName = donorName && donorName.trim() ? donorName.trim() : "भाविक देणगीदार";
        const resolvedEmail = email && email.trim() ? email.trim() : "donor@maanarmada.org";
        const resolvedPhone = phone && phone.trim() ? phone.trim() : "9999999999";

        const numericAmount = Math.round(Number(amount));
        const amountInPaise = numericAmount * 100;
        const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;

        const razorpay = getRazorpayInstance();
        let razorpayOrder;

        if (
            razorpay &&
            process.env.RAZORPAY_KEY_ID &&
            !process.env.RAZORPAY_KEY_ID.includes("placeholder")
        ) {
            // Real Razorpay API call
            razorpayOrder = await razorpay.orders.create({
                amount: amountInPaise,
                currency: "INR",
                receipt: receiptId,
                notes: {
                    donorName: resolvedDonorName,
                    email: resolvedEmail,
                    phone: resolvedPhone,
                    profession: profession || "",
                    donationType: donationType || "General Donation",
                },
            });
        } else {
            // Simulated Test Order for local development / testing before live keys are added
            razorpayOrder = {
                id: `order_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                amount: amountInPaise,
                currency: "INR",
                receipt: receiptId,
                status: "created",
            };
        }

        // Save pending donation record
        const donation = await Donation.create({
            donorName: resolvedDonorName,
            email: resolvedEmail,
            phone: resolvedPhone,
            panNumber: panNumber || "",
            profession: profession || "",
            amount: numericAmount,
            currency: "INR",
            donationType: donationType || "General Donation",
            razorpayOrderId: razorpayOrder.id,
            status: "created",
            address: address || "",
            notes: notes || "",
        });

        return res.status(201).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
            donationId: donation._id,
        });
    } catch (error) {
        console.error("Create Razorpay order error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create donation order",
        });
    }
};

// POST /api/payment/verify-payment
// Verifies payment signature and updates donation status to captured
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification parameters",
            });
        }

        const donation = await Donation.findOne({
            razorpayOrderId: razorpay_order_id,
        });

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation record not found for this order",
            });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;
        let isSignatureValid = false;

        if (secret && !secret.includes("placeholder") && razorpay_signature) {
            // Verify HMAC SHA256 signature
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", secret)
                .update(body.toString())
                .digest("hex");

            isSignatureValid = expectedSignature === razorpay_signature;
        } else {
            // Simulated development / mock test approval
            isSignatureValid = true;
        }

        if (!isSignatureValid) {
            donation.status = "failed";
            await donation.save();

            return res.status(400).json({
                success: false,
                message: "Payment signature verification failed",
            });
        }

        // Generate unique official donation receipt number
        const receiptNumber = `MNG-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

        donation.razorpayPaymentId = razorpay_payment_id;
        donation.razorpaySignature = razorpay_signature || "simulated_signature";
        donation.status = "captured";
        donation.receiptNumber = receiptNumber;
        await donation.save();

        return res.status(200).json({
            success: true,
            message: "Donation received successfully! Thank you for your support.",
            receiptNumber: donation.receiptNumber,
            amount: donation.amount,
            donorName: donation.donorName,
            paymentId: donation.razorpayPaymentId,
            date: donation.updatedAt,
        });
    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Error verifying donation payment",
        });
    }
};

// GET /api/payment/donations
// Admin-only list of all donations
const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find()
            .sort({ createdAt: -1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            count: donations.length,
            data: donations,
        });
    } catch (error) {
        console.error("Get donations error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve donations",
        });
    }
};

// POST /api/payment/record-receipt
// Saves a manual/QR/Bank donation receipt permanently in database
const recordReceipt = async (req, res) => {
    try {
        const {
            donorName,
            amount,
            profession,
            paymentMode,
            paymentId,
            receiptNumber,
            phone,
            email,
            notes,
        } = req.body;

        if (!amount || Number(amount) < 1) {
            return res.status(400).json({
                success: false,
                message: "A valid donation amount (minimum ₹1) is required",
            });
        }

        const permanentTxnId = paymentId && paymentId.trim()
            ? paymentId.trim()
            : `TXN-UPI-${Date.now().toString().slice(-8)}`;

        const permanentReceiptNo = receiptNumber && receiptNumber.trim()
            ? receiptNumber.trim()
            : `MNG-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

        const donation = await Donation.create({
            donorName: (donorName && donorName.trim()) || "भाविक देणगीदार",
            amount: Math.round(Number(amount)),
            profession: profession || "",
            donationType: "General Donation",
            razorpayOrderId: `ORDER-${Date.now()}`,
            razorpayPaymentId: permanentTxnId,
            status: "captured",
            receiptNumber: permanentReceiptNo,
            notes: notes || paymentMode || "PhonePe / UPI QR",
            phone: phone || "",
            email: email || "",
        });

        return res.status(201).json({
            success: true,
            message: "Donation receipt recorded permanently",
            data: donation,
        });
    } catch (error) {
        console.error("Record receipt error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to record donation receipt",
        });
    }
};

module.exports = {
    getRazorpayKey,
    createOrder,
    verifyPayment,
    getDonations,
    recordReceipt,
};

