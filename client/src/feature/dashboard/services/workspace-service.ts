import { useMutation } from "@tanstack/react-query";

import type { CreateWorkspaceValues } from "@/feature/dashboard/workspace-schema";
import { apiClient } from "@/lib/api/api-client";
import {
  ApiError,
  extractFieldErrors,
  toApiError,
  type ApiResponse,
} from "@/lib/api/api-error";

export type CreatedWorkspace = {
  _id: string;
  name: string;
  description?: string;
};

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

export function useCreateWorkspaceService() {
  return useMutation({
    mutationKey: ["workspaces", "create"],
    mutationFn: createWorkspace,
  });
}
