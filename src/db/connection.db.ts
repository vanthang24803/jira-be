import mongoose from "mongoose";

const healthCheckDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL ?? "");

    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB connection is healthy.");
      return true;
    }
    console.log("❌ MongoDB connection is not healthy.");
    return false;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    return false;
  } finally {
    await mongoose.disconnect();
  }
};

export { healthCheckDB };
