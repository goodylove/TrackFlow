// Builds the TrackFlow overview from typed issue data and focused dashboard components.
import {
  ClipboardTextIcon,
  UserCircleIcon,
  UserMinusIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

import { AssignedIssues } from "@/feature/dashboard/components/assigned-issues";
import { PriorityOverview } from "@/feature/dashboard/components/priority-overview";
import { RecentIssuesTable } from "@/feature/dashboard/components/recent-issues-table";
import { StatsCard } from "@/feature/dashboard/components/stats-card";
import { StatusOverview } from "@/feature/dashboard/components/status-overview";
import type { DashboardIssue, DashboardUser } from "@/feature/dashboard/types";

type DashboardHomeProps = {
  issues: DashboardIssue[];
  currentUser: DashboardUser;
};

export function DashboardHome({ issues, currentUser }: DashboardHomeProps) {
  const assignedIssues = issues.filter(
    (issue) => issue.assignee?._id === currentUser._id,
  );
  const unassignedIssues = issues.filter((issue) => issue.assignee === null);
  const overdueIssues = issues.filter(
    (issue) =>
      issue.dueDate &&
      issue.status !== "done" &&
      new Date(issue.dueDate).getTime() < Date.now(),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--marketing-action)]">
            Workspace overview
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Good morning, {currentUser.name.split(" ")[0]}
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          Here is what needs attention across your TrackFlow workspace.
        </p>
      </div>
      <section
        aria-label="Issue statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatsCard
          helper="in this workspace"
          icon={ClipboardTextIcon}
          label="Total issues"
          tone="total"
          value={issues.length}
        />
        <StatsCard
          helper="owned by you"
          icon={UserCircleIcon}
          label="Assigned issues"
          tone="assigned"
          value={assignedIssues.length}
        />
        <StatsCard
          helper="need an owner"
          icon={UserMinusIcon}
          label="Unassigned issues"
          tone="unassigned"
          value={unassignedIssues.length}
        />
        <StatsCard
          helper="past due date"
          icon={WarningCircleIcon}
          label="Overdue issues"
          tone="overdue"
          value={overdueIssues.length}
        />
      </section>
      <section
        aria-label="Issue breakdowns"
        className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.8fr)]"
      >
        <StatusOverview issues={issues} />
        <PriorityOverview issues={issues} />
      </section>
      <section
        aria-label="Issue activity"
        className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.72fr)]"
      >
        <RecentIssuesTable issues={issues} />
        <AssignedIssues issues={assignedIssues} />
      </section>
    </div>
  );
}
