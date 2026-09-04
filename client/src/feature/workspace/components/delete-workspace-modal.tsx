// Requires explicit confirmation before invoking the irreversible workspace deletion.
import { SpinnerGapIcon, TrashIcon, WarningIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { useDeleteWorkspaceService } from "@/feature/dashboard/services/workspace-service";
import { ApiError } from "@/lib/api/api-error";

type DeleteWorkspaceModalProps = {
  onDeleted: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  userId: string;
  workspaceId: string;
  workspaceName: string;
};

export function DeleteWorkspaceModal({
  onDeleted,
  onOpenChange,
  open,
  userId,
  workspaceId,
  workspaceName,
}: DeleteWorkspaceModalProps) {
  const [confirmation, setConfirmation] = useState("");
  const deleteWorkspaceMutation = useDeleteWorkspaceService(userId);
  const isConfirmed = confirmation === workspaceName;

  function handleOpenChange(nextOpen: boolean) {
    if (deleteWorkspaceMutation.isPending) return;
    if (!nextOpen) {
      setConfirmation("");
      deleteWorkspaceMutation.reset();
    }
    onOpenChange(nextOpen);
  }

  async function handleDelete() {
    if (!isConfirmed || deleteWorkspaceMutation.isPending) return;

    try {
      await deleteWorkspaceMutation.mutateAsync(workspaceId);
      setConfirmation("");
      onOpenChange(false);
      onDeleted();
    } catch {
      // The mutation error is rendered below and remains available for retry.
    }
  }

  const errorMessage = deleteWorkspaceMutation.error
    ? deleteWorkspaceMutation.error instanceof ApiError
      ? deleteWorkspaceMutation.error.message
      : "Something went wrong. Please try again."
    : null;

  return (
    <Modal
      description="This action cannot be undone. Confirm the workspace name before continuing."
      icon={<TrashIcon aria-hidden="true" size={21} weight="fill" />}
      onOpenChange={handleOpenChange}
      open={open}
      preventClose={deleteWorkspaceMutation.isPending}
      title="Delete workspace"
    >
      <div className="space-y-5 px-5 py-6 sm:px-6">
        <Alert className="flex items-start gap-3" variant="destructive">
          <WarningIcon aria-hidden="true" className="mt-0.5 shrink-0" size={18} weight="fill" />
          <span>
            Deleting <strong>{workspaceName}</strong> removes the workspace and
            revokes access for its members.
          </span>
        </Alert>

        {errorMessage ? (
          <Alert role="alert" variant="destructive">
            {errorMessage}
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label className="text-sm font-bold" htmlFor="workspace-delete-confirmation">
            Type <span className="font-black text-foreground">{workspaceName}</span> to confirm
          </Label>
          <Input
            autoComplete="off"
            className="h-11 rounded-lg border-[var(--marketing-border)] bg-white px-3 text-sm focus:border-destructive focus:ring-destructive/15"
            disabled={deleteWorkspaceMutation.isPending}
            id="workspace-delete-confirmation"
            onChange={(event) => {
              setConfirmation(event.target.value);
              if (deleteWorkspaceMutation.error) deleteWorkspaceMutation.reset();
            }}
            placeholder={workspaceName}
            value={confirmation}
          />
          <p className="text-xs leading-5 text-muted-foreground">
            The name is case-sensitive and must match exactly.
          </p>
        </div>
      </div>

      <footer className="flex flex-col-reverse gap-2 border-t border-[var(--marketing-border)] bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <Button
          className="h-10 rounded-lg"
          disabled={deleteWorkspaceMutation.isPending}
          onClick={() => handleOpenChange(false)}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="h-10 rounded-lg bg-destructive px-5 text-white hover:bg-destructive/90"
          disabled={!isConfirmed || deleteWorkspaceMutation.isPending}
          onClick={() => void handleDelete()}
          type="button"
        >
          {deleteWorkspaceMutation.isPending ? (
            <SpinnerGapIcon aria-hidden="true" className="animate-spin" size={17} weight="bold" />
          ) : (
            <TrashIcon aria-hidden="true" size={17} weight="bold" />
          )}
          {deleteWorkspaceMutation.isPending ? "Deleting workspace..." : "Delete workspace"}
        </Button>
      </footer>
    </Modal>
  );
}
