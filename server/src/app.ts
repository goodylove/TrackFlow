import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { NotFound } from "./middleware/notfound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import userRouter from "./modules/user/user.routes.js";
import workspaceRouter from "./modules/workspace/workspace.routes.js";
import issueRouter from "./modules/issue/issue.routes.js";

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "Welcome to the TrackFlow API", status: "success" });
});
app.get("/api/v1/health", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(StatusCodes.OK).json({ message: "API is healthy", status: "success" });
});

// user

app.use("/api/v1/users", userRouter);

// workspace

app.use("/api/v1/workspaces", workspaceRouter);
app.use("/api/v1/workspaces", issueRouter);

// Handle unknown routes
app.use(NotFound);
app.use(errorHandler);

export default app;
