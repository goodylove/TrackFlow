import { StatusCodes } from "http-status-codes";
import {
  createIssueSchema,
  getIssuesSchema,
  setIssueAssigneeSchema,
  updateIssueSchema,
} from "./issue.schema.js";
import type { Request, Response } from "express";
import {
  createIssue,
  deleteIssue,
  getIssueById,
  getIssuesByWorkspaceId,
  setIssueAssignee,
  updateIssueDetails,
} from "./issue.service.js";

export const createIssueController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const authorizedMember = req.workspaceMembership;
  if (!req.user) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required",
    });

    return;
  }

  if (!authorizedMember) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Authentication required",
    });

    return;
  }

  const result = createIssueSchema.safeParse({
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

  const newIssue = await createIssue(
    result.data.body,
    authorizedMember.workspaceId,
    req.user.id,
  );

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Issue  created  successfully",
    data: newIssue,
  });
};

export const getIssuesByWorkspaceIdController = async (
  req: Request<{ workspaceId: string }>,
  res: Response,
): Promise<void> => {
  const workspaceId = req.workspaceMembership?.workspaceId;

  const result = getIssuesSchema.safeParse({
    query: req.query,
  });

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid filters",
      errors: result.error.flatten().fieldErrors,
    });

    return;
  }
  if (!workspaceId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Workspace ID is required",
    });

    return;
  }

  const issues = await getIssuesByWorkspaceId(workspaceId, result.data.query);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Issues retrieved successfully",
    data: issues,
  });
};

export const getIssueByIdController = async (
  req: Request<{ workspaceId: string; issueId: string }>,
  res: Response,
): Promise<void> => {
  const workspaceId = req.workspaceMembership?.workspaceId;
  const issueId = req.params.issueId;

  if (!workspaceId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Workspace ID is required",
    });

    return;
  }

  if (!issueId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Issue ID is required",
    });

    return;
  }

  const issue = await getIssueById(workspaceId, issueId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Issue retrieved successfully",
    data: issue,
  });
};

export const setIssueAssigneeController = async (
  req: Request<{ workspaceId: string; issueId: string }>,
  res: Response,
): Promise<void> => {
  const result = setIssueAssigneeSchema.safeParse({
    body: req.body,
  });

  const membership = req.workspaceMembership;

  if (!membership) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Workspace membership has not been verified",
    });

    return;
  }

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const issue = await setIssueAssignee(
    membership.workspaceId,
    result.data.body,
    req.params.issueId,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "assignee updated successfully",
    data: issue,
  });
};

export const updateIssueDetailsController = async (
  req: Request<{ workspaceId: string; issueId: string }>,
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

  const result = updateIssueSchema.safeParse({
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

  const issue = await updateIssueDetails(
    membership.workspaceId,
    result.data.body,
    req.params.issueId,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "issue updated successfully",
    data: {
      issue,
    },
  });
};

export const deleteIssueController = async (
  req: Request<{ workspaceId: string; issueId: string }>,
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

  await deleteIssue(membership.workspaceId, req.params.issueId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Issue deleted successfully",
  });
};
