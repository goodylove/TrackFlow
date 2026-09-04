// Displays searchable, filterable recent issues with row-level actions.
import { useDeferredValue, useState } from "react";
import {
  DotsThreeIcon,
  ListChecksIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SectionEmptyState } from "@/feature/dashboard/components/section-empty-state";
import {
  formatDueDate,
  formatUpdatedTime,
  getInitials,
  priorityLabels,
  priorityStyles,
  statusLabels,
  statusStyles,
} from "@/feature/dashboard/dashboard-utils";
import type {
  DashboardIssue,
  IssuePriority,
  IssueStatus,
} from "@/feature/dashboard/types";

const statusOptions = Object.entries(statusLabels) as [IssueStatus, string][];
const priorityOptions = Object.entries(priorityLabels) as [
  IssuePriority,
  string,
][];

type RecentIssuesTableProps = {
  issues: DashboardIssue[];
  onEditIssue?: (issue: DashboardIssue) => void;
  onDeleteIssue?: (issue: DashboardIssue) => void;
};

export function RecentIssuesTable({
  issues,
  onEditIssue,
  onDeleteIssue,
}: RecentIssuesTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<
    IssuePriority | "all"
  >("all");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const filteredIssues = issues
    .filter((issue) => {
      const matchesSearch =
        !deferredSearch ||
        issue.title.toLowerCase().includes(deferredSearch) ||
        issue._id.toLowerCase().includes(deferredSearch) ||
        issue.assignee?.name.toLowerCase().includes(deferredSearch);
      const matchesStatus =
        statusFilter === "all" || issue.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || issue.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .slice(0, 6);

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="flex-col items-stretch border-b border-border/70">
        <div>
          <CardTitle>Recent issues</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Latest updates in this workspace
          </p>
        </div>

        {issues.length > 0 ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-64">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              aria-label="Search recent issues"
              className="h-10 rounded-lg bg-white pl-9"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search issues..."
              type="search"
              value={search}
            />
          </div>

          <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:items-end">
            <div className="grid gap-1.5">
              {/* <span className="text-xs font-bold text-muted-foreground">
                Status
              </span> */}
              <Select
                onValueChange={(value) =>
                  value && setStatusFilter(value as IssueStatus | "all")
                }
                value={statusFilter}
              >
                <SelectTrigger aria-label="Filter issues by status">
                  <SelectValue>
                    {() =>
                      statusFilter === "all"
                        ? "All statuses"
                        : statusLabels[statusFilter]
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-20">
                  <SelectItem value="all" >All statuses</SelectItem>
                  {statusOptions.map(([status, label]) => (
                    <SelectItem key={status} value={status}>
                      <span
                        aria-hidden="true"
                        className={`size-2 rounded-full ${status === "done"
                          ? "bg-emerald-500"
                          : status === "in_progress"
                            ? "bg-blue-500"
                            : "bg-slate-400"
                          }`}
                      />
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              {/* <span className="text-xs font-bold text-muted-foreground">
                Priority
              </span> */}
              <Select
                onValueChange={(value) =>
                  value && setPriorityFilter(value as IssuePriority | "all")
                }
                value={priorityFilter}
              >
                <SelectTrigger aria-label="Filter issues by priority" >
                  <SelectValue>
                    {() =>
                      priorityFilter === "all"
                        ? "All priorities"
                        : priorityLabels[priorityFilter]
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  {priorityOptions.map(([priority, label]) => (
                    <SelectItem key={priority} value={priority}>
                      <span
                        aria-hidden="true"
                        className={`size-2 rounded-full ${priority === "urgent"
                          ? "bg-red-500"
                          : priority === "high"
                            ? "bg-orange-500"
                            : priority === "medium"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}
                      />
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          </div>
        ) : null}
      </CardHeader>

      {issues.length === 0 ? (
        <div className="p-5">
          <SectionEmptyState
            description="New issues and their latest updates will appear here once work begins."
            icon={ListChecksIcon}
            title="No issues in this workspace"
          />
        </div>
      ) : (
        <Table className="min-w-[52rem]">
        <TableHeader>
          <TableRow className="bg-muted/35 hover:bg-muted/35">
            <TableHead>Issue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-14 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <TableRow key={issue._id}>
                <TableCell>
                  <div className="max-w-[17rem]">
                    <p className="truncate font-bold text-foreground">
                      {issue.title}
                    </p>
                    <span className="text-[0.68rem] text-muted-foreground">
                      {issue._id}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={statusStyles[issue.status]}
                    variant="secondary"
                  >
                    {statusLabels[issue.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={priorityStyles[issue.priority]}
                    variant="outline"
                  >
                    {priorityLabels[issue.priority]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {issue.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback>
                          {getInitials(issue.assignee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">
                        {issue.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Unassigned
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDueDate(issue.dueDate)}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatUpdatedTime(issue.updatedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          aria-label={`Open actions for ${issue.title}`}
                          className="size-8 rounded-lg text-muted-foreground"
                          size="icon"
                          type="button"
                          variant="ghost"
                        />
                      }
                    >
                      <DotsThreeIcon
                        aria-hidden="true"
                        size={19}
                        weight="bold"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Issue actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="text-primary"
                          disabled={!onEditIssue}
                          onClick={() => onEditIssue?.(issue)}
                        >
                          <PencilSimpleIcon aria-hidden="true" size={16} />
                          Edit issue
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10"
                          disabled={!onDeleteIssue}
                          onClick={() => onDeleteIssue?.(issue)}
                        >
                          <TrashIcon aria-hidden="true" size={16} />
                          Delete issue
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                className="h-28 text-center text-sm text-muted-foreground"
                colSpan={7}
              >
                No issues match your search and filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      )}
    </Card>
  );
}
