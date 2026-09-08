// Composes the issue management page and its prerequisite empty states.
import { ArrowsLeftRightIcon, PlusIcon } from "@phosphor-icons/react";
import { useLayoutEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DashboardEmptyState } from "@/feature/dashboard/components/dashboard-empty-state";
import { ChangeIssueAssigneeModal } from "@/feature/issues/components/change-issue-assignee-modal";
import { CreateIssueModal } from "@/feature/issues/components/create-issue-modal";
import { DeleteIssueModal } from "@/feature/issues/components/delete-issue-modal";
import { EditIssueModal } from "@/feature/issues/components/edit-issue-modal";
import { IssueCommentsModal } from "@/feature/issues/components/issue-comments-modal";
import { IssuesEmptyState } from "@/feature/issues/components/issues-empty-state";
import {
  IssuesErrorState,
  IssuesLoadingState,
} from "@/feature/issues/components/issues-load-state";
import {
  IssuesToolbar,
  type PriorityFilter,
  type StatusFilter,
} from "@/feature/issues/components/issues-toolbar";
import { KanbanBoard } from "@/feature/issues/components/kanban-board";
import { useUpdateIssueStatusService } from "@/feature/issues/services/issue-service";
import type {
  Issue,
  IssueAssignee,
  IssueStatus,
} from "@/feature/issues/types";
import { ApiError } from "@/lib/api/api-error";

type IssuesHomeProps = {
  canDeleteIssues?: boolean;
  currentUserId: string;
  initialIssues: Issue[];
  isLoading?: boolean;
  loadError?: string;
  onAddWorkspace: () => void;
  onRetry: () => void;
  retrying?: boolean;
  workspaceId?: string;
  workspaceName?: string;
};

export function IssuesHome({
  canDeleteIssues = false,
  currentUserId,
  initialIssues,
  isLoading = false,
  loadError,
  onAddWorkspace,
  onRetry,
  retrying = false,
  workspaceId,
  workspaceName,
}: IssuesHomeProps) {
  const [issues, setIssues] = useState(initialIssues);
  const [pendingIssueIds, setPendingIssueIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [createIssueOpen, setCreateIssueOpen] = useState(false);
  const [issueToAssign, setIssueToAssign] = useState<Issue | null>(null);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);
  const [issueToEdit, setIssueToEdit] = useState<Issue | null>(null);
  const [issueWithComments, setIssueWithComments] = useState<Issue | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [assigneeId, setAssigneeId] = useState("all");
  const updateStatusMutation = useUpdateIssueStatusService(workspaceId ?? "");

  useLayoutEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);

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

  async function moveIssue(issueId: string, nextStatus: IssueStatus) {
    const previousIssue = issues.find((issue) => issue.id === issueId);
    if (
      !workspaceId ||
      !previousIssue ||
      previousIssue.status === nextStatus ||
      pendingIssueIds.has(issueId)
    ) {
      return;
    }

    setPendingIssueIds((current) => new Set(current).add(issueId));
    setIssues((currentIssues) =>
      currentIssues.map((issue) =>
        issue.id === issueId
          ? { ...issue, status: nextStatus, updatedAt: new Date().toISOString() }
          : issue,
      ),
    );

    try {
      const updatedIssue = await updateStatusMutation.mutateAsync({
        issueId,
        status: nextStatus,
      });

      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === issueId
            ? {
                ...issue,
                status: updatedIssue.status,
                updatedAt: updatedIssue.updatedAt,
              }
            : issue,
        ),
      );
    } catch (updateError) {
      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === issueId
            ? {
                ...issue,
                status: previousIssue.status,
                updatedAt: previousIssue.updatedAt,
              }
            : issue,
        ),
      );
      toast.error("Status change was not saved", {
        description:
          updateError instanceof ApiError
            ? updateError.message
            : "Please try moving the issue again.",
      });
    } finally {
      setPendingIssueIds((current) => {
        const next = new Set(current);
        next.delete(issueId);
        return next;
      });
    }
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
      ) : isLoading ? (
        <IssuesLoadingState />
      ) : loadError ? (
        <IssuesErrorState
          message={loadError}
          onRetry={onRetry}
          retrying={retrying}
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

          <KanbanBoard
            canDeleteIssues={canDeleteIssues}
            issues={filteredIssues}
            onChangeAssignee={setIssueToAssign}
            onEditIssue={setIssueToEdit}
            onDeleteIssue={setIssueToDelete}
            onMoveIssue={moveIssue}
            onOpenComments={setIssueWithComments}
            pendingIssueIds={pendingIssueIds}
          />
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

      {workspaceId && issueToAssign ? (
        <ChangeIssueAssigneeModal
          currentUserId={currentUserId}
          issue={issueToAssign}
          onChanged={(
            issueId: string,
            nextAssignee: IssueAssignee | null,
            updatedAt: string,
          ) => {
            setIssues((currentIssues) =>
              currentIssues.map((issue) =>
                issue.id === issueId
                  ? { ...issue, assignee: nextAssignee, updatedAt }
                  : issue,
              ),
            );
          }}
          onOpenChange={(open) => {
            if (!open) setIssueToAssign(null);
          }}
          open
          workspaceId={workspaceId}
        />
      ) : null}

      {workspaceId && issueToEdit ? (
        <EditIssueModal
          issue={issueToEdit}
          onOpenChange={(open) => {
            if (!open) setIssueToEdit(null);
          }}
          onUpdated={(issueId, updatedIssue) => {
            setIssues((currentIssues) =>
              currentIssues.map((issue) =>
                issue.id === issueId
                  ? {
                      ...issue,
                      title: updatedIssue.title,
                      description: updatedIssue.description ?? "",
                      priority: updatedIssue.priority,
                      dueDate: updatedIssue.dueDate?.slice(0, 10) ?? null,
                      updatedAt: updatedIssue.updatedAt,
                    }
                  : issue,
              ),
            );
          }}
          open
          workspaceId={workspaceId}
        />
      ) : null}

      {canDeleteIssues && workspaceId && issueToDelete ? (
        <DeleteIssueModal
          issue={issueToDelete}
          onDeleted={(issueId) => {
            setIssues((currentIssues) =>
              currentIssues.filter((issue) => issue.id !== issueId),
            );
          }}
          onOpenChange={(open) => {
            if (!open) setIssueToDelete(null);
          }}
          open
          workspaceId={workspaceId}
        />
      ) : null}

      {workspaceId && issueWithComments ? (
        <IssueCommentsModal
          currentUserId={currentUserId}
          issue={issueWithComments}
          onCommentCreated={(issueId) => {
            setIssues((currentIssues) =>
              currentIssues.map((issue) =>
                issue.id === issueId
                  ? { ...issue, commentCount: issue.commentCount + 1 }
                  : issue,
              ),
            );
            setIssueWithComments((currentIssue) =>
              currentIssue?.id === issueId
                ? {
                    ...currentIssue,
                    commentCount: currentIssue.commentCount + 1,
                  }
                : currentIssue,
            );
          }}
          onCommentDeleted={(issueId) => {
            setIssues((currentIssues) =>
              currentIssues.map((issue) =>
                issue.id === issueId
                  ? {
                      ...issue,
                      commentCount: Math.max(issue.commentCount - 1, 0),
                    }
                  : issue,
              ),
            );
            setIssueWithComments((currentIssue) =>
              currentIssue?.id === issueId
                ? {
                    ...currentIssue,
                    commentCount: Math.max(currentIssue.commentCount - 1, 0),
                  }
                : currentIssue,
            );
          }}
          onOpenChange={(open) => {
            if (!open) setIssueWithComments(null);
          }}
          open
          workspaceId={workspaceId}
        />
      ) : null}
    </div>
  );
}
