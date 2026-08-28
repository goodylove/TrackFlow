

import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getDashboardStats } from "./dashboard.service.js";

export const getDashboardStatsController = async (
  req: Request<{ workspaceId: string }>,
  res: Response,
): Promise<void> => {
  const membership = req.workspaceMembership;

  if (!membership) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Workspace membership has not been verified",
    });

    return;
  }

  const stats = await getDashboardStats(membership.workspaceId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: stats,
  });
};
