import { validateRouteIds, validateAssigneeId } from "../../middleware/object-id.middleware.js";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { verifyWorkspaceMembership } from "../../middleware/workspace-membership.middleware.js";
import { authorizeWorkspaceRoles } from "../../middleware/workspace-role.middleware.js";
import {
  createIssueController,
  deleteIssueController,
  getIssueByIdController,
  getIssuesByWorkspaceIdController,
  setIssueAssigneeController,
  updateIssueDetailsController,
} from "./issue.controller.js";


const issueRouter = Router();

issueRouter.get(
  "/:workspaceId/issues",
  authenticate,
  validateRouteIds,
  validateAssigneeId("query"),
  verifyWorkspaceMembership,
  getIssuesByWorkspaceIdController,
);

issueRouter.get(
  "/:workspaceId/issues/:issueId",
  authenticate,
  validateRouteIds,
  verifyWorkspaceMembership,
  getIssueByIdController,
);

issueRouter.post(
  "/:workspaceId/issues",
  authenticate,
  validateRouteIds,
  validateAssigneeId("body"),
  verifyWorkspaceMembership,
  createIssueController,
);

issueRouter.patch(
  "/:workspaceId/issues/:issueId/assignee",
  authenticate,
  validateRouteIds,
  validateAssigneeId("body"),
  verifyWorkspaceMembership,
  setIssueAssigneeController,
);

issueRouter.patch(
  "/:workspaceId/issues/:issueId",
  authenticate,
  validateRouteIds,
  verifyWorkspaceMembership,
  updateIssueDetailsController,
);

issueRouter.delete(
  "/:workspaceId/issues/:issueId",
  authenticate,
  validateRouteIds,
  verifyWorkspaceMembership,
  authorizeWorkspaceRoles("owner", "admin"),
  deleteIssueController,
);

export default issueRouter;
