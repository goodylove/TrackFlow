// Defines dashboard data contracts that mirror TrackFlow's workspace and issue API responses.
export type IssueStatus = "todo" | "in_progress" | "done"
export type IssuePriority = "low" | "medium" | "high" | "urgent"

export type DashboardUser = {
  _id: string
  name: string
  email: string
  avatarUrl?: string
}

export type DashboardWorkspace = {
  _id: string
  name: string
  slug: string
  description?: string
  role: "owner" | "admin" | "member"
}

export type DashboardIssue = {
  _id: string
  workspace: string
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  reporter: DashboardUser
  assignee: DashboardUser | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export type IssueListResponse = {
  issues: DashboardIssue[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}
