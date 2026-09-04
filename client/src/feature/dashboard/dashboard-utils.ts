import type { IssuePriority, IssueStatus } from "@/feature/dashboard/types";

export const statusLabels: Record<IssueStatus, string> = {
  todo: "Todo",
  in_progress: "In progress",
  done: "Done",
};
export const priorityLabels: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const statusStyles: Record<IssueStatus, string> = {
  todo: "border-slate-200 bg-slate-100 text-slate-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export const priorityStyles: Record<IssuePriority, string> = {
  low: "border-slate-200 bg-slate-50 text-slate-600",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-orange-200 bg-orange-50 text-orange-700",
  urgent: "border-red-200 bg-red-50 text-red-700",
};

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatDueDate(value: string | null) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatUpdatedTime(value: string) {
  const hours = Math.max(
    1,
    Math.round((Date.now() - new Date(value).getTime()) / 3_600_000),
  );
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
