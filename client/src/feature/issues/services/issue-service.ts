import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

export type UpdateIssueStatusInput = {
  issueId: string;
  status: IssueStatus;
};

type ApiIssueCore = {
  _id: string;
  workspace: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

type ApiIssueUser = {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type CreatedIssue = ApiIssueCore & {
  reporter: string;
  assignee: string | null;
};

type ListedIssue = ApiIssueCore & {
  reporter: ApiIssueUser;
  assignee: ApiIssueUser | null;
};

type IssueListPayload = {
  issues: ListedIssue[];
  pagination: {
    page: number;
    limit: number;
    totalIssues: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type IssueListResult = Omit<IssueListPayload, "issues"> & {
  issues: Issue[];
};

export const issueQueryKeys = {
  all: ["issues"] as const,
  list: (workspaceId: string) => ["issues", workspaceId, "list"] as const,
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

async function getIssues(workspaceId: string): Promise<IssueListResult> {
  try {
    const { data: payload } = await apiClient.get<ApiResponse<IssueListPayload>>(
      `/workspaces/${workspaceId}/issues`,
      { params: { limit: 100 } },
    );

    if (!payload.success || !payload.data || !Array.isArray(payload.data.issues)) {
      throw new ApiError(payload.message || "Unable to load issues.");
    }

    return {
      ...payload.data,
      issues: payload.data.issues.map((issue) =>
        toBoardIssue(issue, issue.assignee ?? undefined),
      ),
    };
  } catch (error) {
    throw toApiError(error);
  }
}

async function updateIssueStatus(
  workspaceId: string,
  { issueId, status }: UpdateIssueStatusInput,
) {
  try {
    const { data: payload } = await apiClient.patch<
      ApiResponse<{ issue: CreatedIssue }>
    >(`/workspaces/${workspaceId}/issues/${issueId}`, { status });

    if (!payload.success || !payload.data?.issue) {
      throw new ApiError(payload.message || "Unable to update issue status.", {
        fieldErrors: extractFieldErrors(payload.errors),
      });
    }

    return payload.data.issue;
  } catch (error) {
    throw toApiError(error);
  }
}

function getTemporaryIdentifier(issueId: string) {
  return `TF-${issueId.slice(-5).toUpperCase()}`;
}

export function toBoardIssue(
  issue: ApiIssueCore,
  assignee?: WorkspaceMember["user"] | ApiIssueUser,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["issues", workspaceId, "create"],
    mutationFn: (input: CreateIssueInput) => createIssue(workspaceId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: issueQueryKeys.list(workspaceId),
      }),
  });
}

export function useIssuesService(workspaceId: string) {
  return useQuery({
    queryKey: issueQueryKeys.list(workspaceId),
    queryFn: () => getIssues(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useUpdateIssueStatusService(workspaceId: string) {
  return useMutation({
    mutationKey: ["issues", workspaceId, "update-status"],
    mutationFn: (input: UpdateIssueStatusInput) =>
      updateIssueStatus(workspaceId, input),
  });
}
