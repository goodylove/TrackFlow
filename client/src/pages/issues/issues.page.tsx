// Provides the routed Issues page without assuming backend list data.
import { Seo } from "@/components/shared/seo";
import type { DashboardIssue } from "@/feature/dashboard/types";
import { IssuesHome } from "@/feature/issues/issues-home";
import { useDashboardOutletContext } from "@/pages/dashboard/dashboard-layout";

export default function IssuesPage() {
  const { onAddWorkspace, workspaces } = useDashboardOutletContext();
  // The issue list API will replace this empty collection in the integration pass.
  const issues: DashboardIssue[] = [];

  return (
    <>
      <Seo
        description="Create, prioritize, and track workspace issues in TrackFlow."
        noIndex
        title="Issues"
      />
      <IssuesHome
        hasWorkspace={workspaces.length > 0}
        issues={issues}
        onAddWorkspace={onAddWorkspace}
      />
    </>
  );
}
