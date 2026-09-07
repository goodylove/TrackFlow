// Provides the dashboard overview within the shared authenticated shell.
import { Seo } from "@/components/shared/seo";
import {
  DashboardDataErrorState,
  DashboardDataLoadingState,
} from "@/feature/dashboard/components/dashboard-data-state";
import { DashboardHome } from "@/feature/dashboard/dashboard-home";
import {
  useDashboardIssuesService,
  useDashboardStatsService,
} from "@/feature/dashboard/services/dashboard-service";
import { useDashboardOutletContext } from "@/pages/dashboard/dashboard-layout";
import { useWorkspaceStore } from "@/stores/workspace-store";

export default function DashboardPage() {
  const { currentUser, onAddWorkspace, workspaces } =
    useDashboardOutletContext();
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const selectedWorkspace =
    workspaces.find((workspace) => workspace._id === selectedWorkspaceId) ??
    workspaces[0];
  const workspaceId = selectedWorkspace?._id ?? "";
  const statsQuery = useDashboardStatsService(workspaceId);
  const issuesQuery = useDashboardIssuesService(workspaceId);
  const isLoading = Boolean(
    selectedWorkspace && (statsQuery.isPending || issuesQuery.isPending),
  );
  const queryError = statsQuery.error ?? issuesQuery.error;
  const hasLoadError = Boolean(
    selectedWorkspace &&
      queryError &&
      (!statsQuery.data || !issuesQuery.data),
  );

  function retryDashboard() {
    void Promise.all([statsQuery.refetch(), issuesQuery.refetch()]);
  }

  return (
    <>
      <Seo
        description="Review workspace issue activity, priorities, ownership, and recent updates in TrackFlow."
        noIndex
        title="Dashboard"
      />
      {isLoading ? (
        <DashboardDataLoadingState />
      ) : hasLoadError ? (
        <DashboardDataErrorState
          message={
            queryError?.message ?? "Something went wrong. Please try again."
          }
          onRetry={retryDashboard}
          retrying={statsQuery.isFetching || issuesQuery.isFetching}
        />
      ) : (
        <DashboardHome
          currentUser={currentUser}
          hasWorkspace={workspaces.length > 0}
          issues={issuesQuery.data ?? []}
          onAddWorkspace={onAddWorkspace}
          stats={statsQuery.data}
        />
      )}
    </>
  );
}
