// Connects the reusable dashboard shell to API-shaped mock data for the overview route.
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardHome } from "@/feature/dashboard/dashboard-home";
import {
  mockCurrentUser,
  mockIssueResponse,
  mockWorkspaces,
} from "@/feature/dashboard/mock-data";
import type { DashboardUser } from "@/feature/dashboard/types";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardPage() {
  const sessionUser = useAuthStore((state) => state.currentUser);
  const currentUser: DashboardUser = sessionUser
    ? { _id: sessionUser.id, name: sessionUser.name, email: sessionUser.email }
    : mockCurrentUser;
  const issues = sessionUser
    ? mockIssueResponse.issues.map((issue) =>
        issue.assignee?._id === mockCurrentUser._id
          ? { ...issue, assignee: currentUser }
          : issue,
      )
    : mockIssueResponse.issues;

  return (
    <DashboardShell user={currentUser} workspaces={mockWorkspaces}>
      <DashboardHome currentUser={currentUser} issues={issues} />
    </DashboardShell>
  );
}
