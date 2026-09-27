const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/maa_narmada_gurukul";
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log("MongoDB connected successfully");
        console.log("Database:", mongoose.connection.name);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        try {
            console.log("Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/maa_narmada_gurukul)...");
            await mongoose.connect("mongodb://127.0.0.1:27017/maa_narmada_gurukul", {
                serverSelectionTimeoutMS: 3000,
            });
            console.log("Connected to fallback local MongoDB successfully");
        } catch (fallbackErr) {
            console.error("Local MongoDB fallback also failed:", fallbackErr.message);
        }
    }
};

module.exports = connectDB;