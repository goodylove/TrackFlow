// Confirms owner-only membership role changes and refreshes canonical member data.
import { SpinnerGapIcon, UserSwitchIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type WorkspaceMember,
  useUpdateWorkspaceMemberRoleService,
} from "@/feature/dashboard/services/workspace-service";
import { ApiError } from "@/lib/api/api-error";

type AssignableRole = "admin" | "member";

type ChangeMemberRoleModalProps = {
  member: WorkspaceMember;
  onOpenChange: (open: boolean) => void;
  onUpdated: (memberName: string, role: AssignableRole) => void;
  open: boolean;
  userId: string;
  workspaceId: string;
};

const roleLabels: Record<AssignableRole, string> = {
  admin: "Admin",
  member: "Member",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ChangeMemberRoleModal({
  member,
  onOpenChange,
  onUpdated,
  open,
  userId,
  workspaceId,
}: ChangeMemberRoleModalProps) {
  const currentRole = member.role as AssignableRole;
  const [role, setRole] = useState<AssignableRole>(currentRole);
  const updateRoleMutation = useUpdateWorkspaceMemberRoleService(
    userId,
    workspaceId,
  );

  function handleOpenChange(nextOpen: boolean) {
    if (updateRoleMutation.isPending) return;
    if (!nextOpen) updateRoleMutation.reset();
    onOpenChange(nextOpen);
  }

  async function handleUpdate() {
    if (role === currentRole || updateRoleMutation.isPending) return;

    try {
      await updateRoleMutation.mutateAsync({ memberId: member._id, role });
      onOpenChange(false);
      onUpdated(member.user.name, role);
    } catch {
      // Mutation state renders the server error and keeps the modal available.
    }
  }

  const errorMessage = updateRoleMutation.error
    ? updateRoleMutation.error instanceof ApiError
      ? updateRoleMutation.error.message
      : "Something went wrong. Please try again."
    : null;

  return (
    <Modal
      description="Choose the level of workspace access this person should have."
      icon={<UserSwitchIcon aria-hidden="true" size={22} weight="fill" />}
      onOpenChange={handleOpenChange}
      open={open}
      preventClose={updateRoleMutation.isPending}
      title="Change member role"
    >
      <div className="space-y-5 px-5 py-6 sm:px-6">
        <div className="flex items-center gap-3 rounded-xl border border-[var(--marketing-border)] bg-muted/25 p-3">
          <Avatar className="size-10">
            {member.user.avatarUrl ? (
              <AvatarImage alt="" src={member.user.avatarUrl} />
            ) : null}
            <AvatarFallback className="bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]">
              {getInitials(member.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{member.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {member.user.email}
            </p>
          </div>
        </div>

        {errorMessage ? (
          <Alert role="alert" variant="destructive">
            {errorMessage}
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label className="text-sm font-bold" htmlFor="member-role-select">
            Workspace role
          </Label>
          <Select
            disabled={updateRoleMutation.isPending}
            onValueChange={(value) => {
              setRole(value as AssignableRole);
              if (updateRoleMutation.error) updateRoleMutation.reset();
            }}
            value={role}
          >
            <SelectTrigger className="h-11 w-full" id="member-role-select">
              <SelectValue>{roleLabels[role]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs leading-5 text-muted-foreground">
            Admins can add and remove members. Members can collaborate on
            workspace issues.
          </p>
        </div>
      </div>

      <footer className="flex flex-col-reverse gap-2 border-t border-[var(--marketing-border)] bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <Button
          className="h-10 rounded-lg"
          disabled={updateRoleMutation.isPending}
          onClick={() => handleOpenChange(false)}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="h-10 rounded-lg bg-[var(--marketing-action)] px-5 hover:bg-[var(--marketing-action)]/90"
          disabled={role === currentRole || updateRoleMutation.isPending}
          onClick={() => void handleUpdate()}
          type="button"
        >
          {updateRoleMutation.isPending ? (
            <SpinnerGapIcon
              aria-hidden="true"
              className="animate-spin"
              size={17}
              weight="bold"
            />
          ) : (
            <UserSwitchIcon aria-hidden="true" size={17} weight="bold" />
          )}
          {updateRoleMutation.isPending ? "Updating role..." : "Update role"}
        </Button>
      </footer>
    </Modal>
  );
}
