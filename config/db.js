const mongoose = require('mongoose');
const debug = require('debug')('app:db'); 
require('dotenv').config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/papercollection");
        debug("✅ MongoDB connection established.");
    } catch(err) {
        debug("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;