// Provides one place to review, create, and switch between accessible workspaces.
import {
  BuildingsIcon,
  CheckCircleIcon,
  ClockCounterClockwiseIcon,
  ListChecksIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
 
} from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Seo } from "@/components/shared/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardEmptyState } from "@/feature/dashboard/components/dashboard-empty-state";
import type { DashboardWorkspace } from "@/feature/dashboard/types";
import { DeleteWorkspaceModal } from "@/feature/workspace/components/delete-workspace-modal";
import { useDashboardOutletContext } from "@/pages/dashboard/dashboard-layout";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { cn } from "@/lib/utils";

const roleLabels: Record<DashboardWorkspace["role"], string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Recently";

  return formatDistanceToNow(date, { addSuffix: true });
}

export default function WorkspacesPage() {
  const [workspaceToDelete, setWorkspaceToDelete] =
    useState<DashboardWorkspace | null>(null);
  const navigate = useNavigate();
  const { currentUser, onAddWorkspace, workspaces } =
    useDashboardOutletContext();
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const activeWorkspaceId = workspaces.some(
    (workspace) => workspace._id === selectedWorkspaceId,
  )
    ? selectedWorkspaceId
    : workspaces[0]?._id;

  function switchWorkspace(workspaceId: string) {
    selectWorkspace(workspaceId);
    navigate("/dashboard");
  }

  return (
    <>
      <Seo
        description="Review and switch between the TrackFlow workspaces available to your account."
        noIndex
        title="Workspaces"
      />
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>

            <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Workspaces
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Switch between the {workspaces.length} {workspaces.length === 1 ? "workspace" : "workspaces"} available to your account.
            </p>
          </div>
          <Button
            className="h-11 w-full self-start rounded-xl bg-[var(--marketing-action)] px-5 hover:bg-[var(--marketing-action-strong)] sm:w-auto sm:self-auto"
            onClick={onAddWorkspace}
            type="button"
          >
            <PlusIcon aria-hidden="true" size={17} weight="bold" />
            New workspace
          </Button>
        </header>

        {workspaces.length === 0 ? (
          <DashboardEmptyState
            description="Create a workspace to organize issues, invite your team, and keep work moving in one place."
            onAddWorkspace={onAddWorkspace}
          />
        ) : (
          <section
            aria-label="Available workspaces"
            className="grid gap-4 md:grid-cols-2"
          >
            {workspaces.map((workspace) => {
              const isSelected = workspace._id === activeWorkspaceId;

              return (
                <Card
                  aria-current={isSelected ? "true" : undefined}
                  className={cn(
                    "flex min-h-45 flex-col transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-30px_rgba(23,23,34,0.32)]",
                    isSelected &&
                    "border-[var(--marketing-action)] ring-1 ring-[var(--marketing-action)]/35",
                  )}
                  key={workspace._id}
                >
                  <CardHeader className="pb-3">
                    <div className="flex min-w-0 items-start gap-4">
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground",
                          isSelected &&
                          "bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]",
                        )}
                      >
                        <BuildingsIcon aria-hidden="true" size={20} weight="fill" />
                      </span>
                      <div className="min-w-0">
                        <CardTitle className="truncate text-base font-black">
                          {workspace.name}
                        </CardTitle>
                        <p className="mt-0.5 truncate font-mono text-[0.7rem] text-muted-foreground">
                          {workspace.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {isSelected ? (
                        <Badge className="gap-1 border-[var(--marketing-action)]/15 bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]">
                          <CheckCircleIcon aria-hidden="true" size={12} weight="fill" />
                          Active
                        </Badge>
                      ) : null}
                      <Badge variant="outline">{roleLabels[workspace.role]}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col">
                    <p className="line-clamp-3 text-sm leading-6 text-foreground/75">
                      {workspace.description?.trim() ||
                        "No description has been added to this workspace."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <UsersIcon
                          aria-hidden="true"
                          className="text-[var(--marketing-action)]"
                          size={15}
                        />
                        {workspace.memberCount}{" "}
                        {workspace.memberCount === 1 ? "member" : "members"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ListChecksIcon
                          aria-hidden="true"
                          className="text-[var(--marketing-action)]"
                          size={15}
                        />
                        {workspace.openIssueCount} open {workspace.openIssueCount === 1 ? "issue" : "issues"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ClockCounterClockwiseIcon
                          aria-hidden="true"
                          className="text-[var(--marketing-action)]"
                          size={15}
                        />
                        {formatCreatedAt(workspace.createdAt)}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "mt-auto grid gap-2 pt-5",
                        !isSelected && workspace.role === "owner" &&
                          "sm:grid-cols-2",
                      )}
                    >
                      {!isSelected ? (
                        <Button
                          className="h-11 w-full rounded-xl"
                          onClick={() => switchWorkspace(workspace._id)}
                          type="button"
                          variant="outline"
                        >
                          Switch to workspace
                        </Button>
                      ) : null}
                      {workspace.role === "owner" ? (
                        <Button
                          className="h-11 w-full rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5"
                          onClick={() => setWorkspaceToDelete(workspace)}
                          type="button"
                          variant="outline"
                        >
                          <TrashIcon aria-hidden="true" size={16} weight="bold" />
                          Delete workspace
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}
        {workspaceToDelete ? (
          <DeleteWorkspaceModal
            onDeleted={() =>
              toast.success("Workspace deleted", {
                description: `${workspaceToDelete.name} was deleted successfully.`,
              })
            }
            onOpenChange={(open) => {
              if (!open) setWorkspaceToDelete(null);
            }}
            open
            userId={currentUser._id}
            workspaceId={workspaceToDelete._id}
            workspaceName={workspaceToDelete.name}
          />
        ) : null}
      </div>
    </>
  );
}
