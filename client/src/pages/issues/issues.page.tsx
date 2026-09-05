// Provides the routed Issues page without assuming backend list data.
import { Seo } from "@/components/shared/seo";
import { IssuesHome } from "@/feature/issues/issues-home";
import { useIssuesService } from "@/feature/issues/services/issue-service";
import type { Issue } from "@/feature/issues/types";
import { useDashboardOutletContext } from "@/pages/dashboard/dashboard-layout";
import { useWorkspaceStore } from "@/stores/workspace-store";

const emptyIssues: Issue[] = [];

export default function IssuesPage() {
  const { currentUser, onAddWorkspace, workspaces } =
    useDashboardOutletContext();
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const selectedWorkspace =
    workspaces.find((workspace) => workspace._id === selectedWorkspaceId) ??
    workspaces[0];
  const issuesQuery = useIssuesService(selectedWorkspace?._id ?? "");
  const loadError =
    selectedWorkspace && issuesQuery.isError && !issuesQuery.data
      ? issuesQuery.error.message
      : undefined;

  return (
    <>
      <Seo
        description="Create, prioritize, and track workspace issues in TrackFlow."
        noIndex
        title="Issues"
      />
      <IssuesHome
        currentUserId={currentUser._id}
        initialIssues={issuesQuery.data?.issues ?? emptyIssues}
        isLoading={Boolean(selectedWorkspace && issuesQuery.isPending)}
        key={selectedWorkspace?._id ?? "no-workspace"}
        loadError={loadError}
        onAddWorkspace={onAddWorkspace}
        onRetry={() => void issuesQuery.refetch()}
        retrying={issuesQuery.isFetching}
        workspaceId={selectedWorkspace?._id}
        workspaceName={selectedWorkspace?.name}
      />
    </>
  );
}
