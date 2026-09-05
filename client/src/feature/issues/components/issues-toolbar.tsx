import {
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  issuePriorities,
  issuePriorityLabels,
  issueStatuses,
  issueStatusLabels,
  type IssueAssignee,
  type IssuePriority,
  type IssueStatus,
} from "@/feature/issues/types";

export type StatusFilter = IssueStatus | "all";
export type PriorityFilter = IssuePriority | "all";

type IssuesToolbarProps = {
  assigneeId: string;
  assignees: IssueAssignee[];
  hasActiveFilters: boolean;
  onAssigneeChange: (value: string) => void;
  onClearFilters: () => void;
  onPriorityChange: (value: PriorityFilter) => void;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  priority: PriorityFilter;
  query: string;
  resultCount: number;
  status: StatusFilter;
  totalCount: number;
};

export function IssuesToolbar({
  assigneeId,
  assignees,
  hasActiveFilters,
  onAssigneeChange,
  onClearFilters,
  onPriorityChange,
  onQueryChange,
  onStatusChange,
  priority,
  query,
  resultCount,
  status,
  totalCount,
}: IssuesToolbarProps) {
  return (
    <section
      aria-label="Search and filter issues"
      className="rounded-2xl border border-[var(--marketing-border)] bg-white p-3 shadow-[0_14px_35px_-30px_rgba(23,23,34,0.28)]"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1 lg:max-w-md">
          <span className="sr-only">Search issues by title or identifier</span>
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={17}
          />
          <Input
            className="h-10 rounded-lg border-[var(--marketing-border-strong)] bg-[#fafafd] pl-9 pr-3 text-sm focus-visible:border-[var(--marketing-action)] focus-visible:ring-[var(--marketing-action)]/15 md:text-sm"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search title or ID"
            type="search"
            value={query}
          />
        </label>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Select
            onValueChange={(value) => onStatusChange(value as StatusFilter)}
            value={status}
          >
            <SelectTrigger
              aria-label="Filter by status"
              className="min-w-0 sm:min-w-36"
            >
              <FunnelSimpleIcon aria-hidden="true" size={15} />
              <SelectValue>
                {status === "all"
                  ? "All statuses"
                  : issueStatusLabels[status]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {issueStatuses.map((value) => (
                <SelectItem key={value} value={value}>
                  {issueStatusLabels[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              onPriorityChange(value as PriorityFilter)
            }
            value={priority}
          >
            <SelectTrigger
              aria-label="Filter by priority"
              className="min-w-0 sm:min-w-36"
            >
              <SelectValue>
                {priority === "all"
                  ? "All priorities"
                  : issuePriorityLabels[priority]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {issuePriorities.map((value) => (
                <SelectItem key={value} value={value}>
                  {issuePriorityLabels[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              if (value) onAssigneeChange(value);
            }}
            value={assigneeId}
          >
            <SelectTrigger
              aria-label="Filter by assignee"
              className="col-span-2 min-w-0 sm:min-w-40"
            >
              <SelectValue>
                {assigneeId === "all"
                  ? "All assignees"
                  : assigneeId === "unassigned"
                    ? "Unassigned"
                    : (assignees.find(
                        (assignee) => assignee.id === assigneeId,
                      )?.name ?? "All assignees")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {assignees.map((assignee) => (
                <SelectItem key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters ? (
          <Button
            className="h-10 justify-center rounded-lg px-3 text-muted-foreground hover:text-foreground"
            onClick={onClearFilters}
            type="button"
            variant="ghost"
          >
            <XIcon aria-hidden="true" size={15} weight="bold" />
            Clear
          </Button>
        ) : null}
      </div>

      <p
        className="mt-2 px-1 text-xs font-medium text-muted-foreground"
        role="status"
      >
        Showing {resultCount} of {totalCount} issues
      </p>
    </section>
  );
}
