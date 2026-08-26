import { Types } from "mongoose";
import { WorkspaceMember } from "../workspace/workspace-member.model.js";
import { Issue } from "./issue.modal.js";
import type { CreateIssueInput, setIssueAssigneeInput } from "./issue.schema.js";
import { StatusCodes } from "http-status-codes";

export const createIssue = async (
  input: CreateIssueInput,
  workspaceId: string,
  userId: string,
) => {
  if (input.assigneeId) {
    const assigneeMembership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: input.assigneeId,
    });

    if (!assigneeMembership) {
      throw {
        status: StatusCodes.BAD_REQUEST,
        message: "Assignee must belong to this workspace",
      };
    }
  }

  const newIssue = await Issue.create({
    workspace: workspaceId,
    title: input.title,
    ...(input.description !== undefined && {
      description: input.description,
    }),

    ...(input.dueDate !== undefined && {
      dueDate: input.dueDate,
    }),
    ...(input.assigneeId !== undefined && {
      assignee: input.assigneeId,
    }),

    reporter: userId,
  });

  return newIssue;
};

export const getIssuesByWorkspaceId = async (workspaceId: string) => {
  const issues = await Issue.find({
    workspace: workspaceId,
  })
    .populate({
      path: "reporter",
      select: "name email avatarUrl status",
    })
    .populate({
      path: "assignee",
      select: "name email avatarUrl status",
    })
    .sort({ createdAt: -1 });

  return issues;
};

export const getIssueById = async (workspaceId: string, issueId: string) => {
  const issue = await Issue.findOne({
    _id: issueId,
    workspace: workspaceId,
  })
    .populate({
      path: "reporter",
      select: "name email avatarUrl status",
    })
    .populate({
      path: "assignee",
      select: "name email avatarUrl status",
    });

  if (!issue) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Issue not found",
    };
  }

  return issue;
};

export const setIssueAssignee = async (
  workspaceId: string,
  input: setIssueAssigneeInput, // req body
  issueId: string, //params
) => {
  if (!Types.ObjectId.isValid(issueId)) {
    throw {
      status: StatusCodes.FORBIDDEN,
      message: "Invalid issue iD",
    };
  }

  const issue = await Issue.findOne({
    workspace: workspaceId,
    _id: issueId,
  });

  if (!issue) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Issue not found in this workspace",
    };
  }
  const workspaceMember = await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: input.assigneeId,
  });

  if (!workspaceMember) {
    throw {
      status: StatusCodes.BAD_REQUEST,
      message: "Assignee must belong to this workspace",
    };
  }

  issue.assignee = new Types.ObjectId(input.assigneeId);

  await issue.save();

  await issue.populate({
    path: "assignee",
    select: "name email avatarUrl",
  });
  return issue;
};
