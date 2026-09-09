import type { RequestHandler } from "express";
import { Types } from "mongoose";

const validId = (value: unknown): value is string =>
  typeof value === "string" && Types.ObjectId.isValid(value);

export const validateRouteIds: RequestHandler = (req, res, next) => {
  for (const [key, label] of Object.entries({
    workspaceId: "workspace",
    issueId: "issue",
    commentId: "comment",
    memberId: "member",
  })) {
    const value = req.params[key];
    if (value !== undefined && !validId(value)) {
      res.status(400).json({ success: false, message: `Invalid ${label} ID` });
      return;
    }
  }
  next();
};

export const validateAssigneeId =
  (source: "body" | "query"): RequestHandler =>
  (req, res, next) => {
    const value: unknown = req[source]?.assigneeId;
    if (
      value !== undefined &&
      !(source === "body" && value === null) &&
      !validId(value)
    ) {
      res.status(400).json({ success: false, message: "Invalid assignee ID" });
      return;
    }
    next();
  };
