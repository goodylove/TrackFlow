import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateWorkspaceValues } from "@/feature/dashboard/workspace-schema";
import type { DashboardWorkspace } from "@/feature/dashboard/types";
import type { AddWorkspaceMemberValues } from "@/feature/workspace/workspace-member-schema";
import { apiClient } from "@/lib/api/api-client";
import {
  ApiError,
  extractFieldErrors,
  toApiError,
  type ApiResponse,
} from "@/lib/api/api-error";
import { useAuthStore } from "@/stores/auth-store";

export type CreatedWorkspace = {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
};

export type WorkspaceDetails = CreatedWorkspace & {
  createdBy: string;
  updatedAt: string;
};

export type WorkspaceMember = {
  _id: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    status: "active" | "suspended";
    isEmailVerified: boolean;
  };
};

type WorkspaceMemberResponse = Omit<WorkspaceMember, "user"> & {
  user: WorkspaceMember["user"] | null;
};

type WorkspaceMembership = {
  _id: string;
  role: "owner" | "admin" | "member";
  workspace: (CreatedWorkspace & {
    createdBy?: string;
    updatedAt?: string;
    memberCount: number;
    openIssueCount: number;
  }) | null;
};

type WorkspaceSummaryInput = CreatedWorkspace &
  Partial<Pick<DashboardWorkspace, "memberCount" | "openIssueCount">>;

export const workspaceQueryKeys = {
  all: ["workspaces"] as const,
  list: (userId: string) => ["workspaces", "list", userId] as const,
  detail: (userId: string, workspaceId: string) =>
    ["workspaces", "detail", userId, workspaceId] as const,
  members: (userId: string, workspaceId: string) =>
    ["workspaces", "members", userId, workspaceId] as const,
};

function toDashboardWorkspace(
  workspace: WorkspaceSummaryInput,
  role: DashboardWorkspace["role"],
): DashboardWorkspace {
  return {
    _id: workspace._id,
    name: workspace.name,
    description: workspace.description,
    role,
    memberCount: workspace.memberCount ?? 1,
    openIssueCount: workspace.openIssueCount ?? 0,
    createdAt: workspace.createdAt,
    slug: workspace.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
  };
}

async function getWorkspaces() {
  try {
    const { data: payload } = await apiClient.get<
      ApiResponse<WorkspaceMembership[]>
    >("/workspaces");

    if (!payload.success || !Array.isArray(payload.data)) {
      throw new ApiError(payload.message || "Unable to load workspaces.");
    }

    return payload.data.flatMap((membership) =>
      membership.workspace
        ? [toDashboardWorkspace(membership.workspace, membership.role)]
        : [],
    );
  } catch (error) {
    throw toApiError(error);
  }
}

async function getWorkspaceById(workspaceId: string) {
  try {
    const { data: payload } = await apiClient.get<ApiResponse<WorkspaceDetails>>(
      `/workspaces/${workspaceId}`,
    );

    if (!payload.success || !payload.data) {
      throw new ApiError(payload.message || "Unable to load workspace details.");
    }

    return payload.data;
  } catch (error) {
    throw toApiError(error);
  }
}

async function getWorkspaceMembers(workspaceId: string) {
  try {
    const { data: payload } = await apiClient.get<
      ApiResponse<WorkspaceMemberResponse[]>
    >(`/workspaces/${workspaceId}/members`);

    if (!payload.success || !Array.isArray(payload.data)) {
      throw new ApiError(payload.message || "Unable to load workspace members.");
    }

    return payload.data.flatMap((membership) =>
      membership.user ? [{ ...membership, user: membership.user }] : [],
    );
  } catch (error) {
    throw toApiError(error);
  }
}

async function createWorkspace(values: CreateWorkspaceValues) {
  try {
    const { data: payload } = await apiClient.post<
      ApiResponse<CreatedWorkspace>
    >("/workspaces", values);

    if (!payload.success || !payload.data) {
      throw new ApiError(payload.message || "Unable to create workspace.", {
        fieldErrors: extractFieldErrors(payload.errors),
      });
    }

    return payload.data;
  } catch (error) {
    throw toApiError(error);
  }
}

async function deleteWorkspace(workspaceId: string) {
  try {
    const { data: payload } = await apiClient.delete<ApiResponse<never>>(
      `/workspaces/${workspaceId}`,
    );

    if (!payload.success) {
      throw new ApiError(payload.message || "Unable to delete workspace.");
    }
  } catch (error) {
    throw toApiError(error);
  }
}

async function addWorkspaceMember(
  workspaceId: string,
  values: AddWorkspaceMemberValues,
) {
  try {
    const { data: payload } = await apiClient.post<
      ApiResponse<WorkspaceMemberResponse>
    >(`/workspaces/${workspaceId}/members`, values);

    if (!payload.success || !payload.data) {
      throw new ApiError(payload.message || "Unable to add workspace member.", {
        fieldErrors: extractFieldErrors(payload.errors),
      });
    }

    return payload.data;
  } catch (error) {
    throw toApiError(error);
  }
}

type UpdateWorkspaceMemberRoleInput = {
  memberId: string;
  role: "admin" | "member";
};

async function updateWorkspaceMemberRole(
  workspaceId: string,
  { memberId, role }: UpdateWorkspaceMemberRoleInput,
) {
  try {
    const { data: payload } = await apiClient.patch<
      ApiResponse<Omit<WorkspaceMember, "user">>
    >(`/workspaces/${workspaceId}/members/${memberId}/role`, { role });

    if (!payload.success || !payload.data) {
      throw new ApiError(payload.message || "Unable to update member role.", {
        fieldErrors: extractFieldErrors(payload.errors),
      });
    }

    return payload.data;
  } catch (error) {
    throw toApiError(error);
  }
}

async function removeWorkspaceMember(
  workspaceId: string,
  workspaceMemberId: string,
) {
  try {
    const { data: payload } = await apiClient.delete<ApiResponse<never>>(
      `/workspaces/${workspaceId}/members/${workspaceMemberId}`,
    );

    if (!payload.success) {
      throw new ApiError(payload.message || "Unable to remove workspace member.");
    }
  } catch (error) {
    throw toApiError(error);
  }
}

export function useWorkspacesService(userId: string) {
  return useQuery({
    queryKey: workspaceQueryKeys.list(userId),
    queryFn: getWorkspaces,
    enabled: Boolean(userId),
  });
}

export function useWorkspaceDetailsService(
  userId: string,
  workspaceId: string,
) {
  return useQuery({
    queryKey: workspaceQueryKeys.detail(userId, workspaceId),
    queryFn: () => getWorkspaceById(workspaceId),
    enabled: Boolean(userId && workspaceId),
  });
}

export function useWorkspaceMembersService(
  userId: string,
  workspaceId: string,
) {
  return useQuery({
    queryKey: workspaceQueryKeys.members(userId, workspaceId),
    queryFn: () => getWorkspaceMembers(workspaceId),
    enabled: Boolean(userId && workspaceId),
  });
}

export function useCreateWorkspaceService() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.currentUser?.id);

  return useMutation({
    mutationKey: ["workspaces", "create"],
    mutationFn: createWorkspace,
    onSuccess: (workspace) => {
      if (!userId) return;

      queryClient.setQueryData<DashboardWorkspace[]>(
        workspaceQueryKeys.list(userId),
        (current) => [
          toDashboardWorkspace(workspace, "owner"),
          ...(current ?? []).filter((item) => item._id !== workspace._id),
        ],
      );
    },
  });
}

export function useDeleteWorkspaceService(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["workspaces", "delete"],
    mutationFn: deleteWorkspace,
    onSuccess: (_, workspaceId) => {
      queryClient.setQueryData<DashboardWorkspace[]>(
        workspaceQueryKeys.list(userId),
        (current) =>
          (current ?? []).filter((workspace) => workspace._id !== workspaceId),
      );
      queryClient.removeQueries({
        queryKey: workspaceQueryKeys.detail(userId, workspaceId),
      });
      queryClient.removeQueries({
        queryKey: workspaceQueryKeys.members(userId, workspaceId),
      });
    },
  });
}

export function useAddWorkspaceMemberService(
  userId: string,
  workspaceId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["workspaces", workspaceId, "members", "add"],
    mutationFn: (values: AddWorkspaceMemberValues) =>
      addWorkspaceMember(workspaceId, values),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: workspaceQueryKeys.members(userId, workspaceId),
      }),
  });
}

export function useUpdateWorkspaceMemberRoleService(
  userId: string,
  workspaceId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["workspaces", workspaceId, "members", "update-role"],
    mutationFn: updateWorkspaceMemberRole.bind(null, workspaceId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: workspaceQueryKeys.members(userId, workspaceId),
      }),
  });
}

export function useRemoveWorkspaceMemberService(
  userId: string,
  workspaceId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["workspaces", workspaceId, "members", "remove"],
    mutationFn: (workspaceMemberId: string) =>
      removeWorkspaceMember(workspaceId, workspaceMemberId),
    onSuccess: (_, workspaceMemberId) => {
      queryClient.setQueryData<WorkspaceMember[]>(
        workspaceQueryKeys.members(userId, workspaceId),
        (current) =>
          (current ?? []).filter((member) => member._id !== workspaceMemberId),
      );

      return queryClient.invalidateQueries({
        queryKey: workspaceQueryKeys.members(userId, workspaceId),
      });
    },
  });
}
