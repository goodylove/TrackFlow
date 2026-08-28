

import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { verifyWorkspaceMembership } from "../../middleware/workspace-membership.middleware.js";
import { getDashboardStatsController } from "./dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get(
  "/:workspaceId/dashboard/stats",
  authenticate,
  verifyWorkspaceMembership,
  getDashboardStatsController,
);

export default dashboardRouter;
