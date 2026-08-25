import type { Request, Response } from "express";
import {
  addWorkspaceMemberSchema,
  changeWorkspaceMemberRoleSchema,
  createWorkspaceSchema,
} from "./workspace.schema.js";
import { StatusCodes } from "http-status-codes";
import {
  addWorkspaceMember,
  changeWorkspaceMemberRole,
  createWorkSpace,
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaceMembers,
  getWorkspacesByUserId,
  removeWorkspaceMember,
} from "./workspace.service.js";

export const workspaceController = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required",
    });

    return;
  }

  const result = createWorkspaceSchema.safeParse({
    body: req.body,
  });

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const workspace = await createWorkSpace(result.data.body, req.user.id);

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Workspace created successfully",
    data: workspace,
  });
};

export const getWorkspacesByUserIdController = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }
  const workspaces = await getWorkspacesByUserId(req.user.id);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Workspaces retrieved successfully",
    data: workspaces,
  });
};

export const getWorkspaceByIdController = async (
  req: Request<{ workspaceId: string }>,
  res: Response,
) => {
  const workspaceId = req.params.workspaceId;

  if (!workspaceId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Workspace ID is required",
    });

    return;
  }

  const workspace = await getWorkspaceById(workspaceId);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Workspace retrieved successfully",
    data: workspace,
  });
};

export const addWorkspaceMemberController = async (
  req: Request<{ workspaceId: string }>,
  res: Response,
) => {
  const membership = req.workspaceMembership;

  if (!membership) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Workspace membership has not been verified",
    });
    return;
  }

  const result = addWorkspaceMemberSchema.safeParse({
    body: req.body,
  });

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const newMember = await addWorkspaceMember(
    membership.workspaceId,
    result.data.body,
    membership.role,
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Member added successfully",
    data: newMember,
  });
};

export const getWorkspaceMembersController = async (
  req: Request<{ workspaceId: string }>,
  res: Response,
) => {
  const workspaceId = req.workspaceMembership?.workspaceId;

  if (!workspaceId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Workspace ID is required",
    });
    return;
  }

  const members = await getWorkspaceMembers(workspaceId);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Workspace members retrieved successfully",
    data: members,
  });
};

export const deleteWorkspaceController = async (
  req: Request<{ workspaceId: string }>,
  res: Response,
) => {
  const workspaceId = req.workspaceMembership?.workspaceId;

  if (!workspaceId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Workspace ID is required",
    });
    return;
  }

  await deleteWorkspace(workspaceId);

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Workspace deleted successfully",
  });
};

export const changeWorkspaceMembershipRoleController = async (
  req: Request<{ workspaceId: string; memberId: string }>,
  res: Response,
) => {
  const verifiedMembership = req.workspaceMembership;

  if (!verifiedMembership) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Workspace membership has not been verified",
    });

    return;
  }

  const result = changeWorkspaceMemberRoleSchema.safeParse({
    body: req.body,
  });

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const membershipId = req.params.memberId;
  const workspaceId = verifiedMembership.workspaceId;

  const updateMemberRole = await changeWorkspaceMemberRole(
    workspaceId,
    membershipId,
    result.data.body.role,
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Member role  updated successfully",
    data: updateMemberRole,
  });
};

export const removeWorkspaceMemberController = async (
  req: Request<{ workspaceId: string; memberId: string }>,
  res: Response,
) => {
  const authorizedMember = req.workspaceMembership;

  if (!authorizedMember) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Workspace membership has not been verified",
    });

    return;
  }
  const memberId = req.params.memberId;
  await removeWorkspaceMember(authorizedMember?.workspaceId, memberId, authorizedMember?.role);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Workspace membership removed successfully",
  });
};
