import {
  CheckCircleIcon,
  CircleIcon,
  PlusIcon,
  SpinnerGapIcon,
  type Icon,
} from "@phosphor-icons/react";
import { useState, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { IssueCard } from "@/feature/issues/components/issue-card";
import {
  issueStatusLabels,
  type Issue,
  type IssueStatus,
} from "@/feature/issues/types";
import { cn } from "@/lib/utils";

const recentIssueLimit = 3;

const columnStyles: Record<
  IssueStatus,
  { accent: string; icon: Icon; iconClassName: string }
> = {
  todo: {
    accent: "bg-slate-400",
    icon: CircleIcon,
    iconClassName: "text-slate-500",
  },
  in_progress: {
    accent: "bg-[var(--marketing-action)]",
    icon: SpinnerGapIcon,
    iconClassName: "text-[var(--marketing-action)]",
  },
  done: {
    accent: "bg-emerald-500",
    icon: CheckCircleIcon,
    iconClassName: "text-emerald-600",
  },
};

type KanbanColumnProps = {
  draggingIssueId: string | null;
  isDropTarget: boolean;
  issues: Issue[];
  onDragEnd: () => void;
  onDragEnter: (status: IssueStatus) => void;
  onDragStart: (issueId: string) => void;
  onDrop: (issueId: string, status: IssueStatus) => void;
  onMoveIssue: (issueId: string, status: IssueStatus) => void;
  status: IssueStatus;
};

export function KanbanColumn({
  draggingIssueId,
  isDropTarget,
  issues,
  onDragEnd,
  onDragEnter,
  onDragStart,
  onDrop,
  onMoveIssue,
  status,
}: KanbanColumnProps) {
  const [visibleCount, setVisibleCount] = useState(recentIssueLimit);
  const { accent, icon: StatusIcon, iconClassName } = columnStyles[status];
  const visibleIssues = issues.slice(0, visibleCount);
  const remainingIssueCount = Math.max(issues.length - visibleCount, 0);
  const isExpanded = visibleCount > recentIssueLimit;

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    onDragEnter(status);
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    const issueId = event.dataTransfer.getData("text/plain") || draggingIssueId;
    if (issueId) onDrop(issueId, status);
  }

  return (
    <section
      aria-labelledby={`${status}-column-title`}
      className={cn(
        "relative flex min-h-[17rem] flex-col rounded-2xl border border-[var(--marketing-border)] bg-[#f1f2f6] p-3 transition duration-200",
        isDropTarget &&
          "border-[var(--marketing-action)]/55 bg-[var(--marketing-action-soft)]/55 shadow-[inset_0_0_0_1px_rgba(47,55,244,0.12)]",
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1 py-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-5 w-1 rounded-full", accent)} />
          <StatusIcon
            aria-hidden="true"
            className={iconClassName}
            size={18}
            weight={status === "done" ? "fill" : "bold"}
          />
          <h2
            className="text-sm font-black tracking-[-0.01em] text-[#2b2b38]"
            id={`${status}-column-title`}
          >
            {issueStatusLabels[status]}
          </h2>
        </div>
        <span
          aria-label={`${issues.length} ${issues.length === 1 ? "issue" : "issues"}`}
          className="inline-flex min-w-7 items-center justify-center rounded-full bg-white px-2 py-1 text-[0.68rem] font-black text-muted-foreground shadow-sm ring-1 ring-black/5"
        >
          {issues.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {visibleIssues.map((issue) => (
          <IssueCard
            isDragging={draggingIssueId === issue.id}
            issue={issue}
            key={issue.id}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onMoveIssue={onMoveIssue}
          />
        ))}

        {issues.length === 0 ? (
          <div
            className={cn(
              "grid min-h-36 flex-1 place-items-center rounded-xl border border-dashed border-slate-300/90 bg-white/45 px-5 text-center transition-colors",
              isDropTarget &&
                "border-[var(--marketing-action)]/45 bg-white/75",
            )}
          >
            <div>
              <p className="text-sm font-bold text-slate-600">
                {isDropTarget ? "Drop issue here" : "No issues here"}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {isDropTarget
                  ? `Move it to ${issueStatusLabels[status]}`
                  : "Drag an issue here when work changes status."}
              </p>
            </div>
          </div>
        ) : null}

        {remainingIssueCount > 0 ? (
          <Button
            className="mt-1 h-10 w-full rounded-xl border-dashed bg-white/55 text-xs font-bold text-muted-foreground hover:border-[var(--marketing-action)]/30 hover:bg-white hover:text-[var(--marketing-action)]"
            onClick={() => setVisibleCount((count) => count + recentIssueLimit)}
            type="button"
            variant="outline"
          >
            <PlusIcon aria-hidden="true" size={14} weight="bold" />
            Load more ({remainingIssueCount})
          </Button>
        ) : isExpanded && issues.length > recentIssueLimit ? (
          <Button
            className="mt-1 h-9 w-full rounded-lg text-xs font-bold text-muted-foreground"
            onClick={() => setVisibleCount(recentIssueLimit)}
            type="button"
            variant="ghost"
          >
            Show recent only
          </Button>
        ) : null}
      </div>

      {isDropTarget && issues.length > 0 ? (
        <div className="pointer-events-none absolute inset-2 rounded-xl border-2 border-dashed border-[var(--marketing-action)]/35" />
      ) : null}
    </section>
  );
}
