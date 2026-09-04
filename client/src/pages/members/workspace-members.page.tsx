// Connects the selected workspace to its member directory endpoint.
import { UserPlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

import { Seo } from "@/components/shared/seo";
import { Button } from "@/components/ui/button";
import { DashboardEmptyState } from "@/feature/dashboard/components/dashboard-empty-state";
import { useWorkspaceMembersService } from "@/feature/dashboard/services/workspace-service";
import type { WorkspaceMember } from "@/feature/dashboard/services/workspace-service";
import {
  WorkspaceMembersErrorState,
  WorkspaceMembersList,
  WorkspaceMembersLoadingState,
} from "@/feature/workspace/components/workspace-members-list";
import { AddWorkspaceMemberModal } from "@/feature/workspace/components/add-workspace-member-modal";
import { ChangeMemberRoleModal } from "@/feature/workspace/components/change-member-role-modal";
import { RemoveWorkspaceMemberModal } from "@/feature/workspace/components/remove-workspace-member-modal";
import { useDashboardOutletContext } from "@/pages/dashboard/dashboard-layout";
import { useWorkspaceStore } from "@/stores/workspace-store";

export default function WorkspaceMembersPage() {
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<WorkspaceMember | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMember | null>(null);
  const { currentUser, onAddWorkspace, workspaces } =
    useDashboardOutletContext();
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const selectedWorkspace =
    workspaces.find((workspace) => workspace._id === selectedWorkspaceId) ??
    workspaces[0];
  const membersQuery = useWorkspaceMembersService(
    currentUser._id,
    selectedWorkspace?._id ?? "",
  );

  return (
    <>
      <Seo
        description="Review the people with access to the selected TrackFlow workspace."
        noIndex
        title="Workspace members"
      />
      <div className="space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--marketing-action)]">
              {selectedWorkspace?.name ?? "Workspace access"}
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Members
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              See everyone who can collaborate in the selected workspace and understand their level of access.
            </p>
          </div>
          {selectedWorkspace && selectedWorkspace.role !== "member" ? (
            <Button
              className="h-10 shrink-0 rounded-lg bg-[var(--marketing-action)] px-4 hover:bg-[var(--marketing-action)]/90"
              onClick={() => setAddMemberOpen(true)}
              type="button"
            >
              <UserPlusIcon aria-hidden="true" size={17} weight="bold" />
              Add member
            </Button>
          ) : null}
        </header>

        {!selectedWorkspace ? (
          <DashboardEmptyState
            description="Create a workspace before building your team and managing member access."
            onAddWorkspace={onAddWorkspace}
            title="Create a workspace to add members"
          />
        ) : membersQuery.isPending ? (
          <WorkspaceMembersLoadingState />
        ) : membersQuery.isError ? (
          <WorkspaceMembersErrorState
            message={membersQuery.error.message}
            onRetry={() => void membersQuery.refetch()}
            retrying={membersQuery.isFetching}
          />
        ) : (
          <WorkspaceMembersList
            currentUserId={currentUser._id}
            members={membersQuery.data}
            onChangeRole={
              selectedWorkspace.role === "owner"
                ? setMemberToEdit
                : undefined
            }
            canRemoveMember={(member) =>
              selectedWorkspace.role === "owner"
                ? member.role !== "owner"
                : selectedWorkspace.role === "admin" && member.role === "member"
            }
            onRemoveMember={
              selectedWorkspace.role !== "member"
                ? setMemberToRemove
                : undefined
            }
          />
        )}
        {selectedWorkspace && selectedWorkspace.role !== "member" ? (
          <AddWorkspaceMemberModal
            actorRole={selectedWorkspace.role}
            onAdded={(email) =>
              toast.success("Member added", {
                description: `${email} now has access to ${selectedWorkspace.name}.`,
              })
            }
            onOpenChange={setAddMemberOpen}
            open={addMemberOpen}
            userId={currentUser._id}
            workspaceId={selectedWorkspace._id}
            workspaceName={selectedWorkspace.name}
          />
        ) : null}
        {selectedWorkspace && memberToEdit ? (
          <ChangeMemberRoleModal
            member={memberToEdit}
            onOpenChange={(open) => {
              if (!open) setMemberToEdit(null);
            }}
            onUpdated={(memberName, role) => {
              toast.success("Member role updated", {
                description: `${memberName} is now ${role === "admin" ? "an admin" : "a member"}.`,
              });
            }}
            open
            userId={currentUser._id}
            workspaceId={selectedWorkspace._id}
          />
        ) : null}
        {selectedWorkspace && memberToRemove ? (
          <RemoveWorkspaceMemberModal
            member={memberToRemove}
            onOpenChange={(open) => {
              if (!open) setMemberToRemove(null);
            }}
            onRemoved={(memberName) =>
              toast.success("Member removed", {
                description: `${memberName} no longer has access to ${selectedWorkspace.name}.`,
              })
            }
            open
            userId={currentUser._id}
            workspaceId={selectedWorkspace._id}
            workspaceName={selectedWorkspace.name}
          />
        ) : null}
      </div>
    </>
  );
}
