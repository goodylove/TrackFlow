// Connects the reusable dashboard shell to API-shaped dashboard data.
import { useState } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CreateWorkspaceModal } from "@/feature/dashboard/components/create-workspace-modal";
import { DashboardHome } from "@/feature/dashboard/dashboard-home";
import type {
  DashboardIssue,
  DashboardUser,
  DashboardWorkspace,
} from "@/feature/dashboard/types";
import type { CreatedWorkspace } from "@/feature/dashboard/services/workspace-service";
import { useAuthStore } from "@/stores/auth-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

function toDashboardWorkspace(workspace: CreatedWorkspace): DashboardWorkspace {
  return {
    _id: workspace._id,
    name: workspace.name,
    slug: workspace.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
  };
}

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<DashboardWorkspace[]>([]);
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const sessionUser = useAuthStore((state) => state.currentUser);
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);

  if (!sessionUser) return null;

  const currentUser: DashboardUser = {
    _id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
  };
  // Read APIs will replace these empty collections in the next integration pass.
  const issues: DashboardIssue[] = [];

  function handleWorkspaceCreated(createdWorkspace: CreatedWorkspace) {
    const workspace = toDashboardWorkspace(createdWorkspace);
    setWorkspaces((current) => [workspace, ...current]);
    selectWorkspace(workspace._id);
  }

  return (
    <DashboardShell user={currentUser} workspaces={workspaces}>
      <DashboardHome
        currentUser={currentUser}
        hasWorkspace={workspaces.length > 0}
        issues={issues}
        onAddWorkspace={() => setCreateWorkspaceOpen(true)}
      />
      <CreateWorkspaceModal
        onCreated={handleWorkspaceCreated}
        onOpenChange={setCreateWorkspaceOpen}
        open={createWorkspaceOpen}
      />
    </DashboardShell>
  );
}
