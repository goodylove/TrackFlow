import mongoose from "mongoose";
import { env } from "./env.js";

async function connectToDatabase() {
  mongoose.set("bufferCommands", false);
  await mongoose.connect(env.MONGODB_URI);

  console.log("Connected to MongoDB");
}

export default connectToDatabase;
