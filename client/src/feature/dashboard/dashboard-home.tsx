// Builds the TrackFlow overview from typed issue data and focused dashboard components.
import {
  ClipboardTextIcon,
  UserCircleIcon,
  UserMinusIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

import { AssignedIssues } from "@/feature/dashboard/components/assigned-issues";
import { DashboardEmptyState } from "@/feature/dashboard/components/dashboard-empty-state";
import { PriorityOverview } from "@/feature/dashboard/components/priority-overview";
import { RecentIssuesTable } from "@/feature/dashboard/components/recent-issues-table";
import { StatsCard } from "@/feature/dashboard/components/stats-card";
import { StatusOverview } from "@/feature/dashboard/components/status-overview";
import type {
  DashboardIssue,
  DashboardStats,
  DashboardUser,
} from "@/feature/dashboard/types";
import { getGreeting } from "@/lib/helper";

type DashboardHomeProps = {
  issues: DashboardIssue[];
  currentUser: DashboardUser;
  hasWorkspace?: boolean;
  onAddWorkspace?: () => void;
  stats?: DashboardStats;
};

const emptyStats: DashboardStats = {
  totalIssues: 0,
  byStatus: { todo: 0, in_progress: 0, done: 0 },
  byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
  assignedIssues: 0,
  unassignedIssues: 0,
  overdueIssues: 0,
};

export function DashboardHome({
  issues,
  currentUser,
  hasWorkspace = true,
  onAddWorkspace,
  stats = emptyStats,
}: DashboardHomeProps) {
  if (!hasWorkspace) {
    return <DashboardEmptyState onAddWorkspace={onAddWorkspace} />;
  }

  const assignedIssues = issues.filter(
    (issue) => issue.assignee?._id === currentUser._id,
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--marketing-action)]">
            Workspace overview
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            {getGreeting()}, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Here is what needs attention across this workspace.
          </p>
        </div>
        {/* <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          Here is what needs attention across your TrackFlow workspace.
        </p> */}
      </div>
      <section
        aria-label="Issue statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatsCard
          helper={
            stats.totalIssues === 0 ? "No issues yet" : "in this workspace"
          }
          icon={ClipboardTextIcon}
          label="Total issues"
          tone="total"
          value={stats.totalIssues}
        />
        <StatsCard
          helper={
            stats.assignedIssues === 0 ? "Nothing assigned" : "have an owner"
          }
          icon={UserCircleIcon}
          label="Assigned issues"
          tone="assigned"
          value={stats.assignedIssues}
        />
        <StatsCard
          helper={
            stats.unassignedIssues === 0
              ? "No unassigned work"
              : "need an owner"
          }
          icon={UserMinusIcon}
          label="Unassigned issues"
          tone="unassigned"
          value={stats.unassignedIssues}
        />
        <StatsCard
          helper={
            stats.overdueIssues === 0 ? "Nothing overdue" : "past due date"
          }
          icon={WarningCircleIcon}
          label="Overdue issues"
          tone="overdue"
          value={stats.overdueIssues}
        />
      </section>
      <section
        aria-label="Issue breakdowns"
        className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.8fr)]"
      >
        <StatusOverview issues={issues} />
        <PriorityOverview
          byPriority={stats.byPriority}
          totalIssues={stats.totalIssues}
        />
      </section>
      <section
        aria-label="Issue activity"
        className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.8fr)]"
      >
        <RecentIssuesTable issues={issues} />
        <AssignedIssues issues={assignedIssues} />
      </section>
    </div>
  );
}
