// Owns shared authenticated dashboard state across nested dashboard routes.
import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CreateWorkspaceModal } from "@/feature/dashboard/components/create-workspace-modal";
import {
  WorkspaceErrorState,
  WorkspaceLoadingState,
} from "@/feature/dashboard/components/workspace-load-state";
import {
  type CreatedWorkspace,
  useWorkspacesService,
} from "@/feature/dashboard/services/workspace-service";
import type {
  DashboardUser,
  DashboardWorkspace,
} from "@/feature/dashboard/types";
import { useAuthStore } from "@/stores/auth-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

type DashboardOutletContext = {
  currentUser: DashboardUser;
  onAddWorkspace: () => void;
  workspaces: DashboardWorkspace[];
};

export function useDashboardOutletContext() {
  return useOutletContext<DashboardOutletContext>();
}

export default function DashboardLayout() {
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const sessionUser = useAuthStore((state) => state.currentUser);
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const clearSelectedWorkspace = useWorkspaceStore(
    (state) => state.clearSelectedWorkspace,
  );
  const workspacesQuery = useWorkspacesService(sessionUser?.id ?? "");
  const workspaces = workspacesQuery.data ?? [];

  useEffect(() => {
    if (workspacesQuery.isPending || workspacesQuery.isError) return;

    if (workspaces.length === 0) {
      if (selectedWorkspaceId) clearSelectedWorkspace();
      return;
    }

    const selectionIsValid = workspaces.some(
      (workspace) => workspace._id === selectedWorkspaceId,
    );
    if (!selectionIsValid) selectWorkspace(workspaces[0]._id);
  }, [
    clearSelectedWorkspace,
    selectWorkspace,
    selectedWorkspaceId,
    workspaces,
    workspacesQuery.isError,
    workspacesQuery.isPending,
  ]);

  if (!sessionUser) return null;

  const currentUser: DashboardUser = {
    _id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
  };

  function handleWorkspaceCreated(createdWorkspace: CreatedWorkspace) {
    selectWorkspace(createdWorkspace._id);
  }

  return (
    <DashboardShell user={currentUser} workspaces={workspaces}>
      {workspacesQuery.isPending ? (
        <WorkspaceLoadingState />
      ) : workspacesQuery.isError ? (
        <WorkspaceErrorState
          message={workspacesQuery.error.message}
          onRetry={() => void workspacesQuery.refetch()}
          retrying={workspacesQuery.isFetching}
        />
      ) : (
        <Outlet
          context={{
            currentUser,
            onAddWorkspace: () => setCreateWorkspaceOpen(true),
            workspaces,
          } satisfies DashboardOutletContext}
        />
      )}
      <CreateWorkspaceModal
        onCreated={handleWorkspaceCreated}
        onOpenChange={setCreateWorkspaceOpen}
        open={createWorkspaceOpen}
      />
    </DashboardShell>
  );
}
