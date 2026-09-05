export const issueStatuses = ["todo", "in_progress", "done"] as const;
export const issuePriorities = ["low", "medium", "high", "urgent"] as const;

export type IssueStatus = (typeof issueStatuses)[number];
export type IssuePriority = (typeof issuePriorities)[number];

export type IssueAssignee = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type Issue = {
  id: string;
  identifier: string;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: IssueAssignee | null;
  dueDate: string | null;
  commentCount: number;
  updatedAt: string;
};

export const issueStatusLabels: Record<IssueStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

export const issuePriorityLabels: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};
