import mongoose from "mongoose";
import config from "./configs.js";

const uri = `mongodb://${config.db.mongo.host}:${config.db.mongo.port}`;

export const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      maxPoolSize: config.db.mongo.maxPoolSize,
      auth: {
        username: config.db.mongo.username,
        password: config.db.mongo.password,
      },
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      authSource: "admin",
      dbName: config.db.mongo.database,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
