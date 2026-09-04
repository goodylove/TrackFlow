// Connects the selected workspace to its server-backed detail view.
import { useState } from "react";

import { Seo } from "@/components/shared/seo";
import { Alert } from "@/components/ui/alert";
import { DashboardEmptyState } from "@/feature/dashboard/components/dashboard-empty-state";
import { useWorkspaceDetailsService } from "@/feature/dashboard/services/workspace-service";
import {
  WorkspaceDetailsCard,
  WorkspaceDetailsErrorState,
  WorkspaceDetailsLoadingState,
} from "@/feature/workspace/components/workspace-details-card";
import { DeleteWorkspaceModal } from "@/feature/workspace/components/delete-workspace-modal";
import { WorkspaceDangerZone } from "@/feature/workspace/components/workspace-danger-zone";
import { useDashboardOutletContext } from "@/pages/dashboard/dashboard-layout";
import { useWorkspaceStore } from "@/stores/workspace-store";

export default function WorkspaceSettingsPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletedWorkspaceName, setDeletedWorkspaceName] = useState<string | null>(null);
  const { currentUser, onAddWorkspace, workspaces } =
    useDashboardOutletContext();
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const selectedWorkspace =
    workspaces.find((workspace) => workspace._id === selectedWorkspaceId) ??
    workspaces[0];
  const workspaceQuery = useWorkspaceDetailsService(
    currentUser._id,
    selectedWorkspace?._id ?? "",
  );

  return (
    <>
      <Seo
        description="Review the selected TrackFlow workspace profile and access details."
        noIndex
        title="Workspace settings"
      />
      <div className="space-y-5">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--marketing-action)]">
            Workspace administration
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Workspace settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review the identity and access information for your selected workspace.
          </p>
        </header>

        {deletedWorkspaceName ? (
          <Alert role="status" variant="success">
            {deletedWorkspaceName} was deleted successfully.
          </Alert>
        ) : null}

        {!selectedWorkspace ? (
          <DashboardEmptyState
            description="Create a workspace before managing its profile, members, and access settings."
            onAddWorkspace={onAddWorkspace}
            title="Create a workspace to continue"
          />
        ) : workspaceQuery.isPending ? (
          <WorkspaceDetailsLoadingState />
        ) : workspaceQuery.isError ? (
          <WorkspaceDetailsErrorState
            message={workspaceQuery.error.message}
            onRetry={() => void workspaceQuery.refetch()}
            retrying={workspaceQuery.isFetching}
          />
        ) : (
          <>
            <WorkspaceDetailsCard
              details={workspaceQuery.data}
              role={selectedWorkspace.role}
            />
            {selectedWorkspace.role === "owner" ? (
              <WorkspaceDangerZone
                onDelete={() => {
                  setDeletedWorkspaceName(null);
                  setDeleteModalOpen(true);
                }}
                workspaceName={workspaceQuery.data.name}
              />
            ) : null}
            <DeleteWorkspaceModal
              onDeleted={() => setDeletedWorkspaceName(workspaceQuery.data.name)}
              onOpenChange={setDeleteModalOpen}
              open={deleteModalOpen}
              userId={currentUser._id}
              workspaceId={workspaceQuery.data._id}
              workspaceName={workspaceQuery.data.name}
            />
          </>
        )}
      </div>
    </>
  );
}
