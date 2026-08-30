import { Types } from "mongoose";

import { WorkspaceMember } from "../workspace/workspace-member.model.js";
import { Issue } from "./issue.modal.js";
import type {
  CreateIssueInput,
  GetIssuesInput,
  setIssueAssigneeInput,
  UpdateIssueInput,
} from "./issue.schema.js";
import { StatusCodes } from "http-status-codes";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
    ...(input.status !== undefined && {
      status: input.status,
    }),
    ...(input.priority !== undefined && {
      priority: input.priority,
    }),
    reporter: userId,
  });

  return newIssue;
};

export const getIssuesByWorkspaceId = async (
  workspaceId: string,
  filters: GetIssuesInput,
) => {
  const query = {
    workspace: new Types.ObjectId(workspaceId),

    ...(filters.search !== undefined && {
      title: {
        $regex: escapeRegex(filters.search),
        $options: "i",
      },
    }),

    ...(filters.status !== undefined && {
      status: filters.status,
    }),

    ...(filters.priority !== undefined && {
      priority: filters.priority,
    }),

    ...(filters.assigneeId !== undefined && {
      assignee: new Types.ObjectId(filters.assigneeId),
    }),
  };
  const skip = (filters.page - 1) * filters.limit;
  // const issues = await Issue.find(query)
  //   .populate({
  //     path: "reporter",
  //     select: "name email avatarUrl status",
  //   })
  //   .populate({
  //     path: "assignee",
  //     select: "name email avatarUrl status",
  //   })
  //   .sort({ createdAt: -1 });

  // return issues;

  const [issues, totalIssues] = await Promise.all([
    Issue.find(query)
      .populate({
        path: "reporter",
        select: "name email avatarUrl status",
      })
      .populate({
        path: "assignee",
        select: "name email avatarUrl status",
      })
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .skip(skip)
      .limit(filters.limit),

    Issue.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalIssues / filters.limit);

  return {
    issues,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      totalIssues,
      totalPages,
      hasNextPage: filters.page < totalPages,
      hasPreviousPage: filters.page > 1,
    },
  };
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

  // null means remove the current assignee
  if (input.assigneeId === null) {
    issue.assignee = null;

    await issue.save();

    return issue;
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

export const updateIssueDetails = async (
  workspaceId: string,
  input: UpdateIssueInput, // req body
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

  if (input.title !== undefined) {
    issue.title = input.title;
  }

  if (input.description !== undefined) {
    issue.description = input.description;
  }

  if (input.status !== undefined) {
    issue.status = input.status;
  }

  if (input.priority !== undefined) {
    issue.priority = input.priority;
  }

  if (input.dueDate !== undefined) {
    issue.dueDate = input.dueDate;
  }

  await issue.save();

  return issue;
};

export const deleteIssue = async (workspaceId: string, issueId: string) => {
  if (!Types.ObjectId.isValid(issueId)) {
    throw {
      status: StatusCodes.FORBIDDEN,
      message: "Invalid issue iD",
    };
  }

  const issue = await Issue.findOneAndDelete({
    workspace: workspaceId,
    _id: issueId,
  });

  if (!issue) {
    throw {
      status: StatusCodes.NOT_FOUND,
      message: "Issue not found in this workspace",
    };
  }

  return issue;
};
