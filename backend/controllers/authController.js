const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const FeeRecord = require("../models/FeeRecord");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendPasswordResetOtpEmail } = require("../utils/emailService");

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET || "maanarmada_jwt_secret_key_2026",
        {
            expiresIn: "7d",
        }
    );
};

// =====================================================
// REGISTER STUDENT / USER
// =====================================================

const registerUser = async (req, res) => {
    try {
        const { name, email, mobile, password, role } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "नाव, ई-मेल आणि पासवर्ड आवश्यक आहेत (Name, email and password are required)",
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "पासवर्ड किमान ६ अक्षरांचा असावा (Password must be at least 6 characters)",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const cleanMobile = mobile ? String(mobile).trim() : "";

        // Check if user already exists with this email
        const existingEmailUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingEmailUser) {
            return res.status(409).json({
                success: false,
                message: "या ई-मेल पत्त्यावर आधीच खाते अस्तित्वात आहे (Account with this email already exists)",
            });
        }

        // If mobile is provided, check if mobile already exists
        if (cleanMobile) {
            const existingMobileUser = await User.findOne({
                mobile: cleanMobile,
            });

            if (existingMobileUser) {
                return res.status(409).json({
                    success: false,
                    message: "या मोबाईल क्रमांकावर आधीच खाते अस्तित्वात आहे (Account with this mobile already exists)",
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const assignedRole = role === "admin" ? "admin" : "student";

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            mobile: cleanMobile,
            password: hashedPassword,
            role: assignedRole,
        });

        // If student, create profile and fee record automatically
        if (assignedRole === "student") {
            const profile = await StudentProfile.create({
                user: user._id,
                status: "Incomplete",
                personal: {
                    fullName: user.name,
                    email: user.email,
                    mobile: cleanMobile,
                },
            });

            await FeeRecord.create({
                user: user._id,
                studentProfile: profile._id,
                totalFees: 0,
                paidFees: 0,
                remainingFees: 0,
            });
        }

        // Generate token
        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "नोंदणी यशस्वी झाली (Registration successful)",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("User registration error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "सर्व्हर त्रुटी (Server error)",
        });
    }
};

// =====================================================
// USER + ADMIN + STUDENT LOGIN (Email OR Mobile)
// =====================================================

const loginUser = async (req, res) => {
    try {
        const { email, identifier, password } = req.body;
        const loginIdentifier = (identifier || email || "").trim();

        // Check fields
        if (!loginIdentifier || !password) {
            return res.status(400).json({
                success: false,
                message: "ई-मेल / मोबाईल आणि पासवर्ड आवश्यक आहेत (Email/Mobile and password are required)",
            });
        }

        // Search by email OR mobile
        const user = await User.findOne({
            $or: [
                { email: loginIdentifier.toLowerCase() },
                { mobile: loginIdentifier },
            ],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "चुकीचा ई-मेल / मोबाईल किंवा संकेतशब्द (Invalid credentials)",
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "चुकीचा ई-मेल / मोबाईल किंवा संकेतशब्द (Invalid credentials)",
            });
        }

        // Generate token
        const token = generateToken(user);

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
        };

        return res.status(200).json({
            success: true,
            message:
                user.role === "admin"
                    ? "Admin login successful"
                    : "Login successful",
            token,
            user: userData,
            ...(user.role === "admin" ? { admin: userData } : {}),
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "सर्व्हर त्रुटी (Server error)",
        });
    }
};

// =====================================================
// FORGOT PASSWORD — GENERATE OTP
// =====================================================

const forgotPassword = async (req, res) => {
    try {
        const { identifier } = req.body;

        if (!identifier) {
            return res.status(400).json({
                success: false,
                message: "ई-मेल किंवा मोबाईल नंबर आवश्यक आहे",
            });
        }

        const clean = identifier.trim();

        const user = await User.findOne({
            $or: [
                { email: clean.toLowerCase() },
                { mobile: clean },
            ],
        });

        if (!user) {
            // For security, still return generic success message or clear response
            return res.status(404).json({
                success: false,
                message: "हा ई-मेल किंवा मोबाईल क्रमांक नोंदणीकृत नाही (No account found)",
            });
        }

        // Generate 6-digit secure OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 8);

        user.resetPasswordOtp = hashedOtp;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await user.save();

        console.log(`[AUTH] Password Reset OTP generated for ${user.email} / ${user.mobile}`);

        // Send OTP directly to user's Gmail / Email
        await sendPasswordResetOtpEmail({
            toEmail: user.email,
            recipientName: user.name,
            otp,
        });

        return res.status(200).json({
            success: true,
            message: `पासवर्ड रीसेट OTP आपल्या नोंदणीकृत ई-मेलवर (${user.email}) पाठवला आहे. कृपया आपला Gmail इनबॉक्स तपासा.`,
            email: user.email,
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: false,
            message: "OTP तयार करण्यात त्रुटी आली",
        });
    }
};

// =====================================================
// RESET PASSWORD WITH OTP
// =====================================================

const resetPasswordWithOtp = async (req, res) => {
    try {
        const { identifier, otp, newPassword } = req.body;

        if (!identifier || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "ई-मेल/मोबाईल, OTP आणि नवीन पासवर्ड आवश्यक आहेत",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "नवीन पासवर्ड किमान ६ अक्षरांचा असावा",
            });
        }

        const clean = identifier.trim();

        const user = await User.findOne({
            $or: [
                { email: clean.toLowerCase() },
                { mobile: clean },
            ],
        });

        if (!user || !user.resetPasswordOtp || !user.resetPasswordExpires) {
            return res.status(400).json({
                success: false,
                message: "अवैध किंवा कालबाह्य झालेला OTP (Invalid or expired request)",
            });
        }

        if (new Date() > user.resetPasswordExpires) {
            return res.status(400).json({
                success: false,
                message: "OTP ची मुदत संपली आहे. कृपया पुन्हा प्रयत्न करा (OTP expired)",
            });
        }

        const isOtpValid = await bcrypt.compare(String(otp).trim(), user.resetPasswordOtp);
        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                message: "चुकीचा OTP प्रविष्ट केला आहे (Incorrect OTP)",
            });
        }

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordOtp = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "पासवर्ड यशस्वीरीत्या बदलला आहे. आता लॉगिन करा (Password reset successful)",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            success: false,
            message: "पासवर्ड रिसेट करताना सर्व्हर त्रुटी आली",
        });
    }
};

// =====================================================
// GET CURRENT LOGGED-IN USER / ADMIN / STUDENT
// =====================================================

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
        };

        return res.status(200).json({
            success: true,
            user: userData,
            ...(user.role === "admin" ? { admin: userData } : {}),
        });
    } catch (error) {
        console.error("Get user profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to get user profile",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPasswordWithOtp,
    getMe,
};