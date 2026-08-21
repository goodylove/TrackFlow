import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { NotFound } from "./middleware/notfound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({ message: "Welcome to the TrackFlow API", status: "success" });
});
app.get("/api/v1/health", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.status(StatusCodes.OK).json({ message: "API is healthy", status: "success" });
});


// Handle unknown routes
app.use(NotFound);
app.use(errorHandler);

export default app;
