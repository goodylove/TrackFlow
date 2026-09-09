import { validateRouteIds } from "../../middleware/object-id.middleware.js";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { verifyWorkspaceMembership } from "../../middleware/workspace-membership.middleware.js";
import {
  createCommentController,
  deleteOwnCommentController,
  getCommentsByIssueController,
  updateOwnCommentController,
} from "./comment.controller.js";

const commentRoute = Router();

commentRoute.get(
  "/:workspaceId/issues/:issueId/comments",
  authenticate,
  validateRouteIds,
  verifyWorkspaceMembership,
  getCommentsByIssueController,
);

commentRoute.post(
  "/:workspaceId/issues/:issueId/comments",
  authenticate,
  validateRouteIds,
  verifyWorkspaceMembership,
  createCommentController,
);

commentRoute.patch(
  "/:workspaceId/issues/:issueId/comments/:commentId",
  authenticate,
  validateRouteIds,
  verifyWorkspaceMembership,
  updateOwnCommentController,
);

commentRoute.delete(
  "/:workspaceId/issues/:issueId/comments/:commentId",
  authenticate,
  validateRouteIds,
  verifyWorkspaceMembership,
  deleteOwnCommentController,
);

export default commentRoute;
