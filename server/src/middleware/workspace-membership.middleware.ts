import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

import { WorkspaceMember } from "../modules/workspace/workspace-member.model.js";
import { Workspace } from "../modules/workspace/workspace.model.js";

export const verifyWorkspaceMembership = async (
  req: Request<{ workspaceId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.user) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required",
    });

    return;
  }

  const workspaceId = req.params.workspaceId;

  if (!workspaceId || !Types.ObjectId.isValid(workspaceId)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid workspace ID",
    });

    return;
  }

  if (!(await Workspace.exists({ _id: workspaceId }))) {
    res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Workspace not found" });
    return;
  }

  const membership = await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: req.user.id,
  });

  if (!membership) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "You do not have permission to access this workspace",
    });

    return;
  }

  req.workspaceMembership = {
    workspaceId,
    role: membership.role,
  };

  next();
};
