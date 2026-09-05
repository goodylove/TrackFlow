// Provides the routed Issues page without assuming backend list data.
import { Seo } from "@/components/shared/seo";
import { IssuesHome } from "@/feature/issues/issues-home";
import { mockIssues } from "@/feature/issues/mock-data";
import { useDashboardOutletContext } from "@/pages/dashboard/dashboard-layout";
import { useWorkspaceStore } from "@/stores/workspace-store";

export default function IssuesPage() {
  const { currentUser, onAddWorkspace, workspaces } =
    useDashboardOutletContext();
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const selectedWorkspace =
    workspaces.find((workspace) => workspace._id === selectedWorkspaceId) ??
    workspaces[0];

  return (
    <>
      <Seo
        description="Create, prioritize, and track workspace issues in TrackFlow."
        noIndex
        title="Issues"
      />
      <IssuesHome
        currentUserId={currentUser._id}
        initialIssues={mockIssues}
        onAddWorkspace={onAddWorkspace}
        workspaceId={selectedWorkspace?._id}
        workspaceName={selectedWorkspace?.name}
      />
    </>
  );
}
