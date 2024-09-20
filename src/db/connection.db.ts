import mongoose from "mongoose";
import "dotenv/config";

const connection = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB is already connected.");
    return true;
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL ?? "");
    console.log("✅ MongoDB connected successfully.");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    return false;
  }
};

export { connection };
