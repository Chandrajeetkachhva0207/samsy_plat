const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/maa_narmada_gurukul";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB:", uri);

    const adminEmail = "maanarmadasansthan@gmail.com".toLowerCase().trim();
    const adminPassword = "MaaNarmada@2026";
    const adminName = "मा नर्मदा संस्था व्यवस्थापक (Admin)";

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      user.name = adminName;
      user.password = hashedPassword;
      user.role = "admin";
      await user.save();
      console.log("✅ Admin user updated successfully:");
    } else {
      user = await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ New admin user created successfully:");
    }

    console.log({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error setting up admin:", err);
    process.exit(1);
  }
};

seedAdmin();
