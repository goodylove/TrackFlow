import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
} from "./comment.schema.js";
import {
  createComment,
  deleteOwnComment,
  getCommentsByIssue,
  updateOwnComment,
} from "./comment.service.js";

export const createCommentController = async (
  req: Request<{ workspaceId: string; issueId: string }>,
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
      message: "You are not a member of this workspace",
    });

    return;
  }

  const result = createCommentSchema.safeParse({
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

  const newComment = await createComment(
    authorizedMember.workspaceId,
    req.params.issueId,
    req.user.id,
    result.data.body,
  );

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Comment created successfully",
    data: newComment,
  });
};

export const getCommentsByIssueController = async (
  req: Request<{ workspaceId: string; issueId: string }>,
  res: Response,
): Promise<void> => {
  const authorizedMember = req.workspaceMembership;

  if (!authorizedMember) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Workspace membership has not been verified",
    });

    return;
  }

  const result = getCommentsSchema.safeParse({
    query: req.query,
  });

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid pagination parameters",
      errors: result.error.flatten().fieldErrors,
    });

    return;
  }

  const comments = await getCommentsByIssue(
    authorizedMember.workspaceId,
    req.params.issueId,
    result.data.query,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Comments retrieved successfully",
    data: comments,
  });
};

export const updateOwnCommentController = async (
  req: Request<{ workspaceId: string; issueId: string; commentId: string }>,
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
      message: "Workspace membership has not been verified",
    });

    return;
  }

  const result = updateCommentSchema.safeParse({
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

  const updatedComment = await updateOwnComment(
    authorizedMember.workspaceId,
    req.params.issueId,
    req.params.commentId,
    req.user.id,
    result.data.body,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Comment updated successfully",
    data: updatedComment,
  });
};

export const deleteOwnCommentController = async (
  req: Request<{ workspaceId: string; issueId: string; commentId: string }>,
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
      message: "Workspace membership has not been verified",
    });

    return;
  }

  await deleteOwnComment(
    authorizedMember.workspaceId,
    req.params.issueId,
    req.params.commentId,
    req.user.id,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Comment deleted successfully",
  });
};
