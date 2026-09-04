// Composes the issue management page and its prerequisite empty states.
import { PlusIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { DashboardEmptyState } from "@/feature/dashboard/components/dashboard-empty-state";
import type { DashboardIssue } from "@/feature/dashboard/types";
import { IssuesEmptyState } from "@/feature/issues/components/issues-empty-state";

type IssuesHomeProps = {
  hasWorkspace: boolean;
  issues: DashboardIssue[];
  onAddWorkspace: () => void;
  onCreateIssue?: () => void;
};

export function IssuesHome({
  hasWorkspace,
  issues,
  onAddWorkspace,
  onCreateIssue,
}: IssuesHomeProps) {
  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--marketing-action)]">
            Workspace issues
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Issues
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Capture, prioritize, and follow work from the first report through
            completion.
          </p>
        </div>
        {hasWorkspace && issues.length > 0 ? (
          <Button
            className="h-10 rounded-lg bg-[var(--marketing-action)] px-4 hover:bg-[var(--marketing-action)]/90"
            disabled={!onCreateIssue}
            onClick={onCreateIssue}
            type="button"
          >
            <PlusIcon aria-hidden="true" size={17} weight="bold" />
            Create issue
          </Button>
        ) : null}
      </header>

      {!hasWorkspace ? (
        <DashboardEmptyState
          description="Issues belong to a workspace. Create one first, then you can add issues, assign owners, and track progress."
          onAddWorkspace={onAddWorkspace}
          title="Create a workspace before adding issues"
        />
      ) : issues.length === 0 ? (
        <IssuesEmptyState onCreateIssue={onCreateIssue} />
      ) : null}
    </div>
  );
}
