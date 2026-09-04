// Summarizes issues assigned to the signed-in user without duplicating server state.
import { ArrowRightIcon, UserCircleIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionEmptyState } from "@/feature/dashboard/components/section-empty-state";
import {
  priorityStyles,
  statusLabels,
  statusStyles,
} from "@/feature/dashboard/dashboard-utils";
import type { DashboardIssue } from "@/feature/dashboard/types";

export function AssignedIssues({ issues }: { issues: DashboardIssue[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div>
          <CardTitle>Assigned to me</CardTitle>
          <CardDescription className="mt-1">
            Issues that currently need your attention
          </CardDescription>
        </div>
        <span className="flex size-8 items-center justify-center rounded-full bg-[var(--marketing-action-soft)] text-xs font-black text-[var(--marketing-action)]">
          {issues.length}
        </span>
      </CardHeader>
      <CardContent className={issues.length > 0 ? "space-y-2" : undefined}>
        {issues.length === 0 ? (
          <SectionEmptyState
            description="Issues assigned to you will appear here for quick access."
            icon={UserCircleIcon}
            title="Nothing assigned to you"
          />
        ) : (
          issues.map((issue) => (
            <article
              className="group rounded-xl border border-border/70 p-3.5 transition-colors hover:bg-muted/45"
              key={issue._id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[0.65rem] font-bold text-muted-foreground">
                    {issue._id}
                  </span>
                  <h3 className="mt-1 truncate text-sm font-bold">
                    {issue.title}
                  </h3>
                </div>
                <ArrowRightIcon
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  size={16}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Badge
                  className={statusStyles[issue.status]}
                  variant="outline"
                >
                  {statusLabels[issue.status]}
                </Badge>
                <span
                  className={`size-2 rounded-full ${
                    priorityStyles[issue.priority].includes("red")
                      ? "bg-red-500"
                      : priorityStyles[issue.priority].includes("orange")
                        ? "bg-orange-500"
                        : priorityStyles[issue.priority].includes("amber")
                          ? "bg-amber-500"
                          : "bg-slate-400"
                  }`}
                />
                <span className="text-[0.68rem] capitalize text-muted-foreground">
                  {issue.priority}
                </span>
              </div>
            </article>
          ))
        )}
      </CardContent>
    </Card>
  );
}
