// Supplies API-shaped dashboard fixtures until TanStack Query is connected to the backend.
import type { DashboardUser, DashboardWorkspace, IssueListResponse } from "@/feature/dashboard/types"

export const mockCurrentUser: DashboardUser = {
  _id: "usr_01",
  name: "Alex Morgan",
  email: "alex@trackflow.dev",
}

const sam: DashboardUser = { _id: "usr_02", name: "Sam Rivera", email: "sam@trackflow.dev" }
const mina: DashboardUser = { _id: "usr_03", name: "Mina Chen", email: "mina@trackflow.dev" }
const david: DashboardUser = { _id: "usr_04", name: "David Cole", email: "david@trackflow.dev" }

export const mockWorkspaces: DashboardWorkspace[] = [
  { _id: "ws_product", name: "Product team", slug: "product-team" },
  { _id: "ws_platform", name: "Platform", slug: "platform" },
]

export const mockIssueResponse: IssueListResponse = {
  issues: [
    { _id: "TF-124", workspace: "ws_product", title: "Improve issue assignment workflow", description: "Make handoffs clearer when ownership changes.", status: "in_progress", priority: "high", reporter: sam, assignee: mockCurrentUser, dueDate: "2026-09-05T17:00:00.000Z", createdAt: "2026-08-22T09:30:00.000Z", updatedAt: "2026-09-03T08:45:00.000Z" },
    { _id: "TF-123", workspace: "ws_product", title: "Resolve notification delivery delay", description: "Investigate delayed workspace notifications.", status: "todo", priority: "urgent", reporter: mina, assignee: david, dueDate: "2026-09-01T17:00:00.000Z", createdAt: "2026-08-29T11:10:00.000Z", updatedAt: "2026-09-03T07:20:00.000Z" },
    { _id: "TF-122", workspace: "ws_product", title: "Add member role filters", description: "Help workspace owners find members by role.", status: "todo", priority: "medium", reporter: mockCurrentUser, assignee: null, dueDate: "2026-09-10T17:00:00.000Z", createdAt: "2026-08-25T10:00:00.000Z", updatedAt: "2026-09-02T15:30:00.000Z" },
    { _id: "TF-121", workspace: "ws_product", title: "Polish mobile issue details", description: "Tighten small-screen spacing and action placement.", status: "in_progress", priority: "medium", reporter: david, assignee: mockCurrentUser, dueDate: "2026-09-08T17:00:00.000Z", createdAt: "2026-08-20T13:40:00.000Z", updatedAt: "2026-09-02T11:05:00.000Z" },
    { _id: "TF-120", workspace: "ws_product", title: "Document workspace permissions", description: "Clarify member and admin capabilities.", status: "done", priority: "low", reporter: sam, assignee: mina, dueDate: "2026-08-30T17:00:00.000Z", createdAt: "2026-08-15T08:00:00.000Z", updatedAt: "2026-09-01T16:10:00.000Z" },
    { _id: "TF-119", workspace: "ws_product", title: "Fix duplicate issue search results", description: "Remove duplicate records from title search.", status: "done", priority: "high", reporter: mina, assignee: mockCurrentUser, dueDate: "2026-08-28T17:00:00.000Z", createdAt: "2026-08-18T12:10:00.000Z", updatedAt: "2026-08-31T13:25:00.000Z" },
    { _id: "TF-118", workspace: "ws_product", title: "Review issue priority defaults", description: "Confirm the default priority for new issues.", status: "todo", priority: "low", reporter: mockCurrentUser, assignee: null, dueDate: null, createdAt: "2026-08-19T14:00:00.000Z", updatedAt: "2026-08-30T09:15:00.000Z" },
    { _id: "TF-117", workspace: "ws_product", title: "Expose issue update history", description: "Show recent changes in issue details.", status: "in_progress", priority: "urgent", reporter: david, assignee: sam, dueDate: "2026-09-06T17:00:00.000Z", createdAt: "2026-08-17T09:45:00.000Z", updatedAt: "2026-08-29T17:40:00.000Z" },
  ],
  pagination: { page: 1, limit: 10, total: 8, totalPages: 1 },
}
