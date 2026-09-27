const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/User");

dotenv.config({ path: path.join(__dirname, "../.env") });

const createAdmin = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/maa_narmada";
        await mongoose.connect(uri);

        console.log("MongoDB connected");

        const existingAdmin = await User.findOne({
            email: "admin@maanarmada.com",
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }
          
        const hashedPassword = await bcrypt.hash(
            "Admin@12345",
            10
        );

        const admin = await User.create({
            name: "Maa Narmada Admin",
            email: "admin@maanarmada.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created successfully");
        console.log("Email:", admin.email);

        process.exit(0);

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

createAdmin();