// config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(dbURI);
    console.log("MongoDB connected: " + connect.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
