// Composes the issue management page and its prerequisite empty states.
import { ArrowsLeftRightIcon, PlusIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { CreateIssueModal } from "@/feature/issues/components/create-issue-modal";
import { DashboardEmptyState } from "@/feature/dashboard/components/dashboard-empty-state";
import { IssuesEmptyState } from "@/feature/issues/components/issues-empty-state";
import {
  IssuesToolbar,
  type PriorityFilter,
  type StatusFilter,
} from "@/feature/issues/components/issues-toolbar";
import { KanbanBoard } from "@/feature/issues/components/kanban-board";
import type { Issue, IssueStatus } from "@/feature/issues/types";

type IssuesHomeProps = {
  currentUserId: string;
  initialIssues: Issue[];
  onAddWorkspace: () => void;
  workspaceId?: string;
  workspaceName?: string;
};

export function IssuesHome({
  currentUserId,
  initialIssues,
  onAddWorkspace,
  workspaceId,
  workspaceName,
}: IssuesHomeProps) {
  const [issues, setIssues] = useState(initialIssues);
  const [createIssueOpen, setCreateIssueOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [assigneeId, setAssigneeId] = useState("all");

  const assignees = useMemo(
    () =>
      Array.from(
        new Map(
          issues
            .flatMap((issue) => (issue.assignee ? [issue.assignee] : []))
            .map((assignee) => [assignee.id, assignee]),
        ).values(),
      ).sort((first, second) => first.name.localeCompare(second.name)),
    [issues],
  );

  const filteredIssues = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return issues.filter((issue) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        issue.title.toLocaleLowerCase().includes(normalizedQuery) ||
        issue.identifier.toLocaleLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "all" || issue.status === status;
      const matchesPriority =
        priority === "all" || issue.priority === priority;
      const matchesAssignee =
        assigneeId === "all" ||
        (assigneeId === "unassigned"
          ? issue.assignee === null
          : issue.assignee?.id === assigneeId);

      return (
        matchesQuery &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee
      );
    });
  }, [assigneeId, issues, priority, query, status]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    status !== "all" ||
    priority !== "all" ||
    assigneeId !== "all";

  function moveIssue(issueId: string, nextStatus: IssueStatus) {
    setIssues((currentIssues) =>
      currentIssues.map((issue) =>
        issue.id === issueId
          ? { ...issue, status: nextStatus, updatedAt: new Date().toISOString() }
          : issue,
      ),
    );
  }

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setPriority("all");
    setAssigneeId("all");
  }

  return (
    <div className="min-w-0 space-y-5">
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
        {workspaceId ? (
          <Button
            className="h-10 w-full rounded-lg bg-[var(--marketing-action)] px-4 font-bold text-white shadow-[0_12px_24px_-14px_var(--marketing-accent-shadow)] hover:bg-[var(--marketing-action-strong)] sm:w-auto"
            onClick={() => setCreateIssueOpen(true)}
            type="button"
          >
            <PlusIcon aria-hidden="true" size={17} weight="bold" />
            New issue
          </Button>
        ) : null}
      </header>

      {!workspaceId ? (
        <DashboardEmptyState
          description="Issues belong to a workspace. Create one first, then you can add issues, assign owners, and track progress."
          onAddWorkspace={onAddWorkspace}
          title="Create a workspace before adding issues"
        />
      ) : issues.length === 0 ? (
        <IssuesEmptyState onCreateIssue={() => setCreateIssueOpen(true)} />
      ) : (
        <>
          <IssuesToolbar
            assigneeId={assigneeId}
            assignees={assignees}
            hasActiveFilters={hasActiveFilters}
            onAssigneeChange={setAssigneeId}
            onClearFilters={clearFilters}
            onPriorityChange={setPriority}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
            priority={priority}
            query={query}
            resultCount={filteredIssues.length}
            status={status}
            totalCount={issues.length}
          />

          <div className="flex items-center gap-2 px-1 text-xs font-medium text-muted-foreground">
            <ArrowsLeftRightIcon aria-hidden="true" size={15} />
            <p>
              Drag issues between columns, or focus a card and use the left and
              right arrow keys.
            </p>
          </div>

          <KanbanBoard issues={filteredIssues} onMoveIssue={moveIssue} />
        </>
      )}

      {workspaceId && workspaceName ? (
        <CreateIssueModal
          currentUserId={currentUserId}
          onCreated={(issue) => {
            setIssues((currentIssues) => [
              issue,
              ...currentIssues.filter((current) => current.id !== issue.id),
            ]);
          }}
          onOpenChange={setCreateIssueOpen}
          open={createIssueOpen}
          workspaceId={workspaceId}
          workspaceName={workspaceName}
        />
      ) : null}
    </div>
  );
}
