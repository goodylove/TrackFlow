import { useQuery } from "@tanstack/react-query";

import type {
  DashboardIssue,
  DashboardStats,
  DashboardUser,
  IssuePriority,
  IssueStatus,
} from "@/feature/dashboard/types";
import { apiClient } from "@/lib/api/api-client";
import { ApiError, toApiError, type ApiResponse } from "@/lib/api/api-error";

type ApiDashboardStats = {
  totalIssues: number;
  byStatus: Partial<Record<IssueStatus, number>>;
  byPriority: Partial<Record<IssuePriority, number>>;
  assignedIssues: number;
  unassignedIssues: number;
  overdueIssues: number;
};

type ApiDashboardIssue = Omit<
  DashboardIssue,
  "identifier" | "description" | "dueDate"
> & {
  description?: string;
  dueDate?: string | null;
  reporter: DashboardUser;
  assignee: DashboardUser | null;
};

type ApiIssueListPayload = {
  issues: ApiDashboardIssue[];
  pagination: {
    page: number;
    limit: number;
    totalIssues: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  stats: (workspaceId: string) =>
    ["dashboard", workspaceId, "stats"] as const,
  issues: (workspaceId: string) =>
    ["dashboard", workspaceId, "issues"] as const,
};

function getIssueIdentifier(issueId: string) {
  return `TF-${issueId.slice(-5).toUpperCase()}`;
}

function toDashboardStats(stats: ApiDashboardStats): DashboardStats {
  return {
    totalIssues: stats.totalIssues,
    byStatus: {
      todo: stats.byStatus.todo ?? 0,
      in_progress: stats.byStatus.in_progress ?? 0,
      done: stats.byStatus.done ?? 0,
    },
    byPriority: {
      low: stats.byPriority.low ?? 0,
      medium: stats.byPriority.medium ?? 0,
      high: stats.byPriority.high ?? 0,
      urgent: stats.byPriority.urgent ?? 0,
    },
    assignedIssues: stats.assignedIssues,
    unassignedIssues: stats.unassignedIssues,
    overdueIssues: stats.overdueIssues,
  };
}

function toDashboardIssue(issue: ApiDashboardIssue): DashboardIssue {
  return {
    ...issue,
    identifier: getIssueIdentifier(issue._id),
    description: issue.description ?? "",
    dueDate: issue.dueDate ?? null,
  };
}

async function getDashboardStats(workspaceId: string) {
  try {
    const { data: payload } = await apiClient.get<
      ApiResponse<ApiDashboardStats>
    >(`/workspaces/${workspaceId}/dashboard/stats`);

    if (!payload.success || !payload.data) {
      throw new ApiError(
        payload.message || "Unable to load dashboard statistics.",
      );
    }

    return toDashboardStats(payload.data);
  } catch (error) {
    throw toApiError(error);
  }
}

async function getDashboardIssues(workspaceId: string) {
  try {
    const { data: payload } = await apiClient.get<
      ApiResponse<ApiIssueListPayload>
    >(`/workspaces/${workspaceId}/issues`, {
      params: { limit: 100 },
    });

    if (
      !payload.success ||
      !payload.data ||
      !Array.isArray(payload.data.issues)
    ) {
      throw new ApiError(payload.message || "Unable to load dashboard issues.");
    }

    return payload.data.issues
      .map(toDashboardIssue)
      .sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() -
          new Date(first.updatedAt).getTime(),
      );
  } catch (error) {
    throw toApiError(error);
  }
}

export function useDashboardStatsService(workspaceId: string) {
  return useQuery({
    queryKey: dashboardQueryKeys.stats(workspaceId),
    queryFn: () => getDashboardStats(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useDashboardIssuesService(workspaceId: string) {
  return useQuery({
    queryKey: dashboardQueryKeys.issues(workspaceId),
    queryFn: () => getDashboardIssues(workspaceId),
    enabled: Boolean(workspaceId),
  });
}
