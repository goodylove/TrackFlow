import { StatusCodes } from "http-status-codes";

import { Issue } from "../issue/issue.modal.js";
import { Types } from "mongoose";
import { Comment } from "./comment.model.js";
import type {
  CreateCommentInput,
  GetCommentsInput,
  UpdateCommentInput,
} from "./comment.schema.js";

export const createComment = async (
  workspaceId: string,
  issueId: string,
  userId: string,
  input: CreateCommentInput,
) => {
  if (!Types.ObjectId.isValid(issueId)) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid issue ID",
    };
  }
  const issue = await Issue.findOne({
    workspace: workspaceId,
    _id: new Types.ObjectId(issueId),
  });

  if (!issue) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Issue not found in this workspace",
    };
  }

  const comment = await Comment.create({
    workspace: workspaceId,
    issue: issueId,
    author: userId,
    content: input.content,
  });
  await comment.populate(
    {
      path: "author",
      select: "name email"
    },
    
  );
  return comment;
};

export const getCommentsByIssue = async (
  workspaceId: string,
  issueId: string,
  filters: GetCommentsInput,
) => {
  if (!Types.ObjectId.isValid(issueId)) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid issue ID",
    };
  }

  const issueObjectId = new Types.ObjectId(issueId);

  const issue = await Issue.findOne({
    workspace: workspaceId,
    _id: issueObjectId,
  });

  if (!issue) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Issue not found in this workspace",
    };
  }

  const query = {
    workspace: workspaceId,
    issue: issueObjectId,
  };

  const skip = (filters.page - 1) * filters.limit;

  const [comments, totalComments] = await Promise.all([
    Comment.find(query)
      .populate({
        path: "author",
        select: "name email avatarUrl status",
      })
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .skip(skip)
      .limit(filters.limit),
    Comment.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalComments / filters.limit);

  return {
    comments,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      totalComments,
      totalPages,
      hasNextPage: filters.page < totalPages,
      hasPreviousPage: filters.page > 1,
    },
  };
};

export const updateOwnComment = async (
  workspaceId: string,
  issueId: string,
  commentId: string,
  userId: string,
  input: UpdateCommentInput,
) => {
  if (!Types.ObjectId.isValid(issueId)) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid issue ID",
    };
  }

  if (!Types.ObjectId.isValid(commentId)) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid comment ID",
    };
  }

  const issueObjectId = new Types.ObjectId(issueId);
  const commentObjectId = new Types.ObjectId(commentId);

  const issue = await Issue.findOne({
    workspace: workspaceId,
    _id: issueObjectId,
  });

  if (!issue) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Issue not found in this workspace",
    };
  }

  const comment = await Comment.findOne({
    _id: commentObjectId,
    workspace: workspaceId,
    issue: issueObjectId,
    author: userId,
  });

  if (!comment) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Comment not found or you are not allowed to update it",
    };
  }

  comment.content = input.content;
  await comment.save();

  await comment.populate({
    path: "author",
    select: "name email avatarUrl status",
  });

  return comment;
};

export const deleteOwnComment = async (
  workspaceId: string,
  issueId: string,
  commentId: string,
  userId: string,
) => {
  if (!Types.ObjectId.isValid(issueId)) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid issue ID",
    };
  }

  if (!Types.ObjectId.isValid(commentId)) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: "Invalid comment ID",
    };
  }

  const issueObjectId = new Types.ObjectId(issueId);
  const commentObjectId = new Types.ObjectId(commentId);

  const issue = await Issue.findOne({
    workspace: workspaceId,
    _id: issueObjectId,
  });

  if (!issue) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Issue not found in this workspace",
    };
  }

  const comment = await Comment.findOneAndDelete({
    _id: commentObjectId,
    workspace: workspaceId,
    issue: issueObjectId,
    author: userId,
  });

  if (!comment) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Comment not found or you are not allowed to delete it",
    };
  }

  return comment;
};
