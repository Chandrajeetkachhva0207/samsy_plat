const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/maa_narmada";
        await mongoose.connect(uri);

        console.log("MongoDB connected successfully");
        console.log("Database:", mongoose.connection.name);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.error("Make sure your MongoDB server is running (e.g., net start MongoDB or mongod) or MONGODB_URI in backend/.env is correct.");
    }
};

module.exports = connectDB;