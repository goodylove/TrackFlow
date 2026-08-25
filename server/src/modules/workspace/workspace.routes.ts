import Router from "express";
import {
  addWorkspaceMemberController,
  changeWorkspaceMembershipRoleController,
  deleteWorkspaceController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
  getWorkspacesByUserIdController,
  removeWorkspaceMemberController,
  workspaceController,
} from "./workspace.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { verifyWorkspaceMembership } from "../../middleware/workspace-membership.middleware.js";
import { authorizeWorkspaceRoles } from "../../middleware/workspace-role.middleware.js";

const workspaceRouter = Router();

// Create workspace
workspaceRouter.post("/", authenticate, workspaceController);
// Get workspace by the workspace owner
workspaceRouter.get("/", authenticate, getWorkspacesByUserIdController);
// Get workspace by workspace Id
workspaceRouter.get(
  "/:workspaceId",
  authenticate,
  verifyWorkspaceMembership,
  getWorkspaceByIdController,
);
// Get workspace members
workspaceRouter.get(
  "/:workspaceId/members",
  authenticate,
  verifyWorkspaceMembership,
  getWorkspaceMembersController,
);
// Delete workspace
workspaceRouter.delete(
  "/:workspaceId",
  authenticate,
  verifyWorkspaceMembership,
  authorizeWorkspaceRoles("owner"),
  deleteWorkspaceController,
);
// Add a user to a workspace
workspaceRouter.post(
  "/:workspaceId/members",
  authenticate,
  verifyWorkspaceMembership,
  authorizeWorkspaceRoles("owner", "admin"),
  addWorkspaceMemberController,
);

// Update membership role by the workspace owner
workspaceRouter.patch(
  "/:workspaceId/members/:memberId/role",
  authenticate,
  verifyWorkspaceMembership,
  authorizeWorkspaceRoles("owner"),
  changeWorkspaceMembershipRoleController,
);
// Remove a member from the workspace
workspaceRouter.delete(
  "/:workspaceId/members/:memberId",
  authenticate,
  verifyWorkspaceMembership,
  authorizeWorkspaceRoles("owner", "admin"),
  removeWorkspaceMemberController,
);

export default workspaceRouter;
