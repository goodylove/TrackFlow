import mongoose from "mongoose";

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI as string;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }
  mongoose.set("bufferCommands", false);
  await mongoose.connect(mongoUri);

  console.log("Connected to MongoDB");
}

export default connectToDatabase;
