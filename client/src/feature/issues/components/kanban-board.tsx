import { useState } from "react";

import { KanbanColumn } from "@/feature/issues/components/kanban-column";
import {
  issueStatusLabels,
  issueStatuses,
  type Issue,
  type IssueStatus,
} from "@/feature/issues/types";

type KanbanBoardProps = {
  issues: Issue[];
  onMoveIssue: (issueId: string, status: IssueStatus) => void;
};

export function KanbanBoard({ issues, onMoveIssue }: KanbanBoardProps) {
  const [draggingIssueId, setDraggingIssueId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<IssueStatus | null>(null);
  const [announcement, setAnnouncement] = useState("");

  function moveIssue(issueId: string, status: IssueStatus) {
    const issue = issues.find((candidate) => candidate.id === issueId);
    if (!issue || issue.status === status) {
      setDraggingIssueId(null);
      setDropTarget(null);
      return;
    }

    onMoveIssue(issueId, status);
    setAnnouncement(
      `${issue.identifier} moved to ${issueStatusLabels[status]}.`,
    );
    setDraggingIssueId(null);
    setDropTarget(null);
  }

  function clearDragState() {
    setDraggingIssueId(null);
    setDropTarget(null);
  }

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <div
        aria-label="Issue status board"
        className="grid auto-cols-[minmax(17.5rem,86vw)] grid-flow-col items-start gap-4 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-color:#cfd1dc_transparent] xl:auto-cols-auto xl:grid-flow-row xl:grid-cols-3 xl:overflow-visible xl:pb-0"
        id="issue-board"
      >
        {issueStatuses.map((status) => {
          const statusIssues = issues
            .filter((issue) => issue.status === status)
            .sort(
              (first, second) =>
                new Date(second.updatedAt).getTime() -
                new Date(first.updatedAt).getTime(),
            );

          return (
            <KanbanColumn
              draggingIssueId={draggingIssueId}
              isDropTarget={dropTarget === status}
              issues={statusIssues}
              key={status}
              onDragEnd={clearDragState}
              onDragEnter={setDropTarget}
              onDragStart={setDraggingIssueId}
              onDrop={moveIssue}
              onMoveIssue={moveIssue}
              status={status}
            />
          );
        })}
      </div>
    </>
  );
}
