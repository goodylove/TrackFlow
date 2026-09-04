// Provides the dashboard overview within the shared authenticated shell.
import { Seo } from "@/components/shared/seo";
import { DashboardHome } from "@/feature/dashboard/dashboard-home";
import type { DashboardIssue } from "@/feature/dashboard/types";
import { useDashboardOutletContext } from "@/pages/dashboard/dashboard-layout";

export default function DashboardPage() {
  const { currentUser, onAddWorkspace, workspaces } =
    useDashboardOutletContext();
  // Read APIs will replace these empty collections in the next integration pass.
  const issues: DashboardIssue[] = [];

  return (
    <>
      <Seo
        description="Review workspace issue activity, priorities, ownership, and recent updates in TrackFlow."
        noIndex
        title="Dashboard"
      />
      <DashboardHome
        currentUser={currentUser}
        hasWorkspace={workspaces.length > 0}
        issues={issues}
        onAddWorkspace={onAddWorkspace}
      />
    </>
  );
}
