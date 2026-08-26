import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { verifyWorkspaceMembership } from "../../middleware/workspace-membership.middleware.js";
import {
  createIssueController,
  getIssueByIdController,
  getIssuesByWorkspaceIdController,
  setIssueAssigneeController,
} from "./issue.controller.js";


const issueRouter = Router();

issueRouter.get(
  "/:workspaceId/issues",
  authenticate,
  verifyWorkspaceMembership,
  getIssuesByWorkspaceIdController,
);

issueRouter.get(
  "/:workspaceId/issues/:issueId",
  authenticate,
  verifyWorkspaceMembership,
  getIssueByIdController,
);

issueRouter.post(
  "/:workspaceId/issues",
  authenticate,
  verifyWorkspaceMembership,
  createIssueController,
);

issueRouter.patch(
  "/:workspaceId/issues/:issueId/assignee",
  authenticate,
  verifyWorkspaceMembership,

  setIssueAssigneeController,
);

export default issueRouter;
