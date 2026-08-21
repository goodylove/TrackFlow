import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";




async function connectToDatabase() {
    try {
        const client = new MongoClient(process.env.MONGODB_URI as string);
        await client.connect();
        console.log("Connected to MongoDB");
        return client;

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectToDatabase;

