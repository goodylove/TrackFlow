import { useMutation } from "@tanstack/react-query";

import type { WorkspaceMember } from "@/feature/dashboard/services/workspace-service";
import type {
  Issue,
  IssuePriority,
  IssueStatus,
} from "@/feature/issues/types";
import { apiClient } from "@/lib/api/api-client";
import {
  ApiError,
  extractFieldErrors,
  toApiError,
  type ApiResponse,
} from "@/lib/api/api-error";

export type CreateIssueInput = {
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId: string | null;
  dueDate?: string;
};

export type CreatedIssue = {
  _id: string;
  workspace: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  reporter: string;
  assignee: string | null;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

async function createIssue(workspaceId: string, input: CreateIssueInput) {
  try {
    const { data: payload } = await apiClient.post<ApiResponse<CreatedIssue>>(
      `/workspaces/${workspaceId}/issues`,
      input,
    );

    if (!payload.success || !payload.data) {
      throw new ApiError(payload.message || "Unable to create issue.", {
        fieldErrors: extractFieldErrors(payload.errors),
      });
    }

    return payload.data;
  } catch (error) {
    throw toApiError(error);
  }
}

function getTemporaryIdentifier(issueId: string) {
  return `TF-${issueId.slice(-5).toUpperCase()}`;
}

export function toBoardIssue(
  issue: CreatedIssue,
  assignee?: WorkspaceMember["user"],
): Issue {
  return {
    id: issue._id,
    identifier: getTemporaryIdentifier(issue._id),
    title: issue.title,
    status: issue.status,
    priority: issue.priority,
    assignee: assignee
      ? {
          id: assignee._id,
          name: assignee.name,
          avatarUrl: assignee.avatarUrl,
        }
      : null,
    dueDate: issue.dueDate?.slice(0, 10) ?? null,
    commentCount: 0,
    updatedAt: issue.updatedAt,
  };
}

export function useCreateIssueService(workspaceId: string) {
  return useMutation({
    mutationKey: ["issues", workspaceId, "create"],
    mutationFn: (input: CreateIssueInput) => createIssue(workspaceId, input),
  });
}
