const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET || "maanarmada_jwt_secret_key_2026",
        {
            expiresIn: "1d",
        }
    );
};


// =====================================================
// REGISTER NORMAL USER
// =====================================================

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create normal user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user",
        });

        // Generate token
        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("User registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// =====================================================
// USER + ADMIN LOGIN
// =====================================================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find user by email
        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate token
        const token = generateToken(user);

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        return res.status(200).json({
            success: true,
            message:
                user.role === "admin"
                    ? "Admin login successful"
                    : "Login successful",

            token,

            // Normal user
            user: userData,

            // Keep admin response for existing admin frontend compatibility
            ...(user.role === "admin"
                ? {
                    admin: userData,
                }
                : {}),
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// =====================================================
// GET CURRENT LOGGED-IN USER / ADMIN
// =====================================================

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password"
        );

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
            role: user.role,
        };

        return res.status(200).json({
            success: true,

            user: userData,

            // Keep admin response for existing admin frontend compatibility
            ...(user.role === "admin"
                ? {
                    admin: userData,
                }
                : {}),
        });

    } catch (error) {
        console.error("Get user profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to get user profile",
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    registerUser,
    loginUser,
    getMe,
};