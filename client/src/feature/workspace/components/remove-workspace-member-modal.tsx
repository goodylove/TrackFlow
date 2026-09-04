// Confirms access revocation before removing a workspace membership.
import { SpinnerGapIcon, TrashIcon, UserMinusIcon } from "@phosphor-icons/react";

import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  type WorkspaceMember,
  useRemoveWorkspaceMemberService,
} from "@/feature/dashboard/services/workspace-service";
import { ApiError } from "@/lib/api/api-error";

type RemoveWorkspaceMemberModalProps = {
  member: WorkspaceMember;
  onOpenChange: (open: boolean) => void;
  onRemoved: (memberName: string) => void;
  open: boolean;
  userId: string;
  workspaceId: string;
  workspaceName: string;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function RemoveWorkspaceMemberModal({
  member,
  onOpenChange,
  onRemoved,
  open,
  userId,
  workspaceId,
  workspaceName,
}: RemoveWorkspaceMemberModalProps) {
  const removeMemberMutation = useRemoveWorkspaceMemberService(
    userId,
    workspaceId,
  );

  function handleOpenChange(nextOpen: boolean) {
    if (removeMemberMutation.isPending) return;
    if (!nextOpen) removeMemberMutation.reset();
    onOpenChange(nextOpen);
  }

  async function handleRemove() {
    if (removeMemberMutation.isPending) return;

    try {
      await removeMemberMutation.mutateAsync(member._id);
      onOpenChange(false);
      onRemoved(member.user.name);
    } catch {
      // Mutation state renders the server error and keeps the modal available.
    }
  }

  const errorMessage = removeMemberMutation.error
    ? removeMemberMutation.error instanceof ApiError
      ? removeMemberMutation.error.message
      : "Something went wrong. Please try again."
    : null;

  return (
    <Modal
      description={`Revoke this person's access to ${workspaceName}.`}
      icon={<UserMinusIcon aria-hidden="true" size={22} weight="fill" />}
      onOpenChange={handleOpenChange}
      open={open}
      preventClose={removeMemberMutation.isPending}
      title="Remove workspace member"
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

        <Alert variant="destructive">
          This member will immediately lose access to the workspace. You can add
          them again later if needed.
        </Alert>

        {errorMessage ? (
          <Alert role="alert" variant="destructive">
            {errorMessage}
          </Alert>
        ) : null}
      </div>

      <footer className="flex flex-col-reverse gap-2 border-t border-[var(--marketing-border)] bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <Button
          className="h-10 rounded-lg"
          disabled={removeMemberMutation.isPending}
          onClick={() => handleOpenChange(false)}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="h-10 rounded-lg bg-destructive px-5 text-white hover:bg-destructive/90"
          disabled={removeMemberMutation.isPending}
          onClick={() => void handleRemove()}
          type="button"
        >
          {removeMemberMutation.isPending ? (
            <SpinnerGapIcon
              aria-hidden="true"
              className="animate-spin"
              size={17}
              weight="bold"
            />
          ) : (
            <TrashIcon aria-hidden="true" size={17} weight="bold" />
          )}
          {removeMemberMutation.isPending ? "Removing member..." : "Remove member"}
        </Button>
      </footer>
    </Modal>
  );
}
