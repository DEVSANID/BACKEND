import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI); // ✅ No need for extra options
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1); // Ensure process exits on connection failure
    }
};

export default connectDb;
