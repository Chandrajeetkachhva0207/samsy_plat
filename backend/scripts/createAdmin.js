

const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");

const User = require("../models/User");

// Load environment variables
dotenv.config({
    path: path.join(__dirname, "../.env"),
});

// =====================================================
// PROMOTE EXISTING USER TO ADMIN
// =====================================================

const promoteToAdmin = async () => {
    try {
        // Get email from command line
        const email = process.argv[2];

        if (!email) {
            console.log("");
            console.log("Please provide the user's email.");
            console.log("");
            console.log("Usage:");
            console.log(
                "node scripts/createAdmin.js user@example.com"
            );
            console.log("");

            process.exit(1);
        }

        // MongoDB connection
        const uri =
            process.env.MONGODB_URI ||
            "mongodb://127.0.0.1:27017/maa_narmada";

        await mongoose.connect(uri);

        console.log("MongoDB connected");

        // Find existing user
        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        // User doesn't exist
        if (!user) {
            console.log("");
            console.log(
                `No user found with email: ${email}`
            );
            console.log("");
            console.log(
                "The user must register first."
            );

            await mongoose.disconnect();
            process.exit(1);
        }

        // Already admin
        if (user.role === "admin") {
            console.log("");
            console.log("This user is already an admin.");
            console.log("");
            console.log("Name:", user.name);
            console.log("Email:", user.email);
            console.log("Role:", user.role);

            await mongoose.disconnect();
            process.exit(0);
        }

        // Promote user to admin
        user.role = "admin";

        await user.save();

        console.log("");
        console.log("-----------------------------------");
        console.log("User promoted to admin successfully");
        console.log("-----------------------------------");
        console.log("Name:", user.name);
        console.log("Email:", user.email);
        console.log("Role:", user.role);
        console.log("-----------------------------------");
        console.log("");
        console.log(
            "Existing password was not changed."
        );
        console.log("");

        await mongoose.disconnect();

        process.exit(0);

    } catch (error) {
        console.error("");
        console.error(
            "Error:",
            error.message
        );
        console.error("");

        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            // Ignore disconnect errors
        }

        process.exit(1);
    }
};

promoteToAdmin();
