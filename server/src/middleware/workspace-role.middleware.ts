import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { WorkspaceRole } from "../modules/workspace/workspace-member.model.js";

export const authorizeWorkspaceRoles = (...allowedRoles: WorkspaceRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const membership = req.workspaceMembership;

    if (!membership) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Workspace membership has not been verified",
      });

      return;
    }

    if (!allowedRoles.includes(membership.role)) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to perform this action",
      });

      return;
    }

    next();
  };
};
