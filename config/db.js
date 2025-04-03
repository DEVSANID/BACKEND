import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(` MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on("disconnected", () => {
            console.log(" MongoDB Disconnected");
        });

        mongoose.connection.on("error", (err) => {
            console.error(" MongoDB Error:", err.message);
        });

    } catch (error) {
        console.error(" MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

// Graceful shutdown handling
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log(" MongoDB connection closed due to app termination");
    process.exit(0);
});

export default connectDb;
