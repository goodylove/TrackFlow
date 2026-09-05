import {
  CalendarBlankIcon,
  ChatCircleIcon,
  CheckCircleIcon,
  CircleIcon,
  DotsSixVerticalIcon,
  DotsThreeIcon,
  SpinnerGapIcon,
  type Icon,
} from "@phosphor-icons/react";
import type { DragEvent, KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssigneeAvatar } from "@/feature/issues/components/assignee-avatar";
import { PriorityBadge } from "@/feature/issues/components/priority-badge";
import {
  issueStatusLabels,
  issueStatuses,
  type Issue,
  type IssueStatus,
} from "@/feature/issues/types";
import { cn } from "@/lib/utils";

const statusIcons: Record<IssueStatus, Icon> = {
  todo: CircleIcon,
  in_progress: SpinnerGapIcon,
  done: CheckCircleIcon,
};

function formatDueDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

type IssueCardProps = {
  issue: Issue;
  isDragging: boolean;
  onDragEnd: () => void;
  onDragStart: (issueId: string) => void;
  onMoveIssue: (issueId: string, status: IssueStatus) => void;
};

export function IssueCard({
  issue,
  isDragging,
  onDragEnd,
  onDragStart,
  onMoveIssue,
}: IssueCardProps) {
  function handleDragStart(event: DragEvent<HTMLElement>) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", issue.id);
    onDragStart(issue.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;

    const currentIndex = issueStatuses.indexOf(issue.status);
    const nextIndex =
      event.key === "ArrowRight"
        ? currentIndex + 1
        : event.key === "ArrowLeft"
          ? currentIndex - 1
          : currentIndex;

    if (
      nextIndex === currentIndex ||
      nextIndex < 0 ||
      nextIndex >= issueStatuses.length
    ) {
      return;
    }

    event.preventDefault();
    onMoveIssue(issue.id, issueStatuses[nextIndex]);
  }

  return (
    <article
      aria-describedby={`${issue.id}-keyboard-help`}
      aria-grabbed={isDragging}
      className={cn(
        "group cursor-grab rounded-xl border border-[var(--marketing-border)] bg-white p-4 shadow-[0_10px_28px_-24px_rgba(23,23,34,0.45)] outline-none transition duration-200 hover:-translate-y-0.5 hover:border-[var(--marketing-border-strong)] hover:shadow-[0_18px_34px_-24px_rgba(23,23,34,0.35)] focus-visible:ring-2 focus-visible:ring-[var(--marketing-action)]/35 active:cursor-grabbing",
        isDragging &&
          "scale-[0.98] border-[var(--marketing-action)]/35 opacity-50 shadow-none",
      )}
      draggable
      onDragEnd={onDragEnd}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <span className="sr-only" id={`${issue.id}-keyboard-help`}>
        Press left or right arrow to move this issue between status columns.
      </span>

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <DotsSixVerticalIcon
            aria-hidden="true"
            className="-ml-1 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500"
            size={16}
            weight="bold"
          />
          <span className="font-mono text-[0.68rem] font-bold tracking-wide text-muted-foreground">
            {issue.identifier}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <PriorityBadge priority={issue.priority} />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label={`Move ${issue.identifier}`}
                  className="-mr-2 size-7 rounded-lg text-muted-foreground opacity-70 hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  draggable={false}
                  size="icon"
                  variant="ghost"
                />
              }
            >
              <DotsThreeIcon aria-hidden="true" size={17} weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Move to status</DropdownMenuLabel>
                {issueStatuses.map((status) => {
                  const StatusIcon = statusIcons[status];
                  return (
                    <DropdownMenuItem
                      disabled={status === issue.status}
                      key={status}
                      onClick={() => onMoveIssue(issue.id, status)}
                    >
                      <StatusIcon aria-hidden="true" size={16} />
                      {issueStatusLabels[status]}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h3 className="mt-3 min-h-12 text-[0.94rem] font-bold leading-6 tracking-[-0.015em] text-[#232331]">
        {issue.title}
      </h3>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex min-w-0 items-center gap-3 text-xs font-semibold text-muted-foreground">
          {issue.dueDate ? (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <CalendarBlankIcon aria-hidden="true" size={15} />
              <span className="sr-only">Due </span>
              {formatDueDate(issue.dueDate)}
            </span>
          ) : null}
          <span
            aria-label={`${issue.commentCount} ${issue.commentCount === 1 ? "comment" : "comments"}`}
            className="inline-flex items-center gap-1.5"
          >
            <ChatCircleIcon aria-hidden="true" size={15} />
            {issue.commentCount}
          </span>
        </div>
        <AssigneeAvatar assignee={issue.assignee} />
      </div>
    </article>
  );
}
