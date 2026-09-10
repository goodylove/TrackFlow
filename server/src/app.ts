import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { NotFound } from "./middleware/notfound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { StatusCodes } from "http-status-codes";
import userRouter from "./modules/user/user.routes.js";
import workspaceRouter from "./modules/workspace/workspace.routes.js";
import issueRouter from "./modules/issue/issue.routes.js";
import commentRoute from "./modules/comment/comment.routes.js";
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";
import { env } from "./config/env.js";
import mongoose from "mongoose";
import { verifyRequestOrigin } from "./middleware/csrf.middleware.js";
import path from "node:path";
const app = express();

app.use(helmet());
app.use(morgan("dev"));

app.use(
  cors({
    origin: (origin, callback) => callback(null, origin === env.CLIENT_ORIGIN),
    credentials: true,
  }),
);

app.use("/api/v1", verifyRequestOrigin);

app.use(express.json());
app.use(cookieParser());

app.get("/api/v1", (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "Welcome to the TrackFlow API", status: "success" });
});
app.get("/api/v1/health", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(StatusCodes.OK).json({ message: "API is healthy", status: "success" });
});

app.get("/api/v1/ready", (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.set("Cache-Control", "no-store");
  res.status(ready ? 200 : 503).json({
    message: ready ? "API is ready" : "API is not ready",
    status: ready ? "success" : "error",
  });
});

// User

app.use("/api/v1/users", userRouter);

// Workspace

app.use("/api/v1/workspaces", workspaceRouter);
// Issues
app.use("/api/v1/workspaces", issueRouter);

// Comment
app.use("/api/v1/workspaces", commentRoute);

// Dashboard
app.use("/api/v1/workspaces", dashboardRouter);

// Serve the frontend in production
if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.resolve(process.cwd(), "../client/dist");

  app.use(express.static(clientDistPath));

  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) {
      next();
      return;
    }

    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// Handle unknown routes
app.use(NotFound);
app.use(errorHandler);

export default app;
