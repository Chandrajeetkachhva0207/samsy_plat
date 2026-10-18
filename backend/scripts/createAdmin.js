const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

// =====================================================
// CREATE OR UPDATE ADMIN USER
// =====================================================

const createOrPromoteAdmin = async () => {
  try {
    const email = (process.argv[2] || "maanarmadasansthan@gmail.com").toLowerCase().trim();
    const password = process.argv[3] || "MaaNarmada@2026";
    const name = process.argv[4] || "मा नर्मदा संस्था व्यवस्थापक (Admin)";

    const uri =
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/maa_narmada_gurukul";

    await mongoose.connect(uri);
    console.log("MongoDB connected:", uri);

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.findOne({ email });

    if (user) {
      user.role = "admin";
      user.password = hashedPassword;
      if (name && !user.name) user.name = name;
      await user.save();

      console.log("");
      console.log("-----------------------------------");
      console.log("Admin account updated successfully!");
      console.log("-----------------------------------");
      console.log("Name:", user.name);
      console.log("Email:", user.email);
      console.log("Role:", user.role);
      console.log("Password:", password);
      console.log("-----------------------------------");
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });

      console.log("");
      console.log("-----------------------------------");
      console.log("New Admin account created successfully!");
      console.log("-----------------------------------");
      console.log("Name:", user.name);
      console.log("Email:", user.email);
      console.log("Role:", user.role);
      console.log("Password:", password);
      console.log("-----------------------------------");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error creating/updating admin:", error.message);
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
  }
};

createOrPromoteAdmin();
