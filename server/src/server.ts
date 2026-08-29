import app from "./app.js";
import connectToDatabase from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

void startServer();
