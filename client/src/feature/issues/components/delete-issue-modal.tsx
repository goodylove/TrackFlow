import { SpinnerGapIcon, TrashIcon, WarningIcon } from "@phosphor-icons/react";
import { toast } from "@/components/ui/toaster";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDeleteIssueService } from "@/feature/issues/services/issue-service";
import type { Issue } from "@/feature/issues/types";
import { ApiError } from "@/lib/api/api-error";

type DeleteIssueModalProps = {
  issue: Issue;
  onDeleted: (issueId: string) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  workspaceId: string;
};

export function DeleteIssueModal({
  issue,
  onDeleted,
  onOpenChange,
  open,
  workspaceId,
}: DeleteIssueModalProps) {
  const deleteIssueMutation = useDeleteIssueService(workspaceId);

  function handleOpenChange(nextOpen: boolean) {
    if (deleteIssueMutation.isPending) return;
    if (!nextOpen) deleteIssueMutation.reset();
    onOpenChange(nextOpen);
  }

  async function handleDelete() {
    if (deleteIssueMutation.isPending) return;

    try {
      await deleteIssueMutation.mutateAsync(issue.id);
      onDeleted(issue.id);
      onOpenChange(false);
      toast.success("Issue deleted", {
        description: `${issue.identifier} was removed from the workspace.`,
      });
    } catch {
      // The mutation error is rendered below and remains available for retry.
    }
  }

  const errorMessage = deleteIssueMutation.error
    ? deleteIssueMutation.error instanceof ApiError
      ? deleteIssueMutation.error.message
      : "Something went wrong. Please try again."
    : null;

  return (
    <Modal
      description={`Permanently remove ${issue.identifier} from this workspace.`}
      icon={<TrashIcon aria-hidden="true" size={21} weight="fill" />}
      onOpenChange={handleOpenChange}
      open={open}
      preventClose={deleteIssueMutation.isPending}
      title="Delete issue"
    >
      <div className="space-y-5 px-5 py-6 sm:px-6">
        <div className="rounded-xl border border-[var(--marketing-border)] bg-muted/25 p-4">
          <p className="font-mono text-[0.68rem] font-bold tracking-wide text-muted-foreground">
            {issue.identifier}
          </p>
          <p className="mt-1 text-sm font-bold leading-6 text-foreground">
            {issue.title}
          </p>
        </div>

        <Alert className="flex items-start gap-3" variant="destructive">
          <WarningIcon
            aria-hidden="true"
            className="mt-0.5 shrink-0"
            size={18}
            weight="fill"
          />
          <span>
            This action cannot be undone. The issue will no longer appear on
            the board.
          </span>
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
          disabled={deleteIssueMutation.isPending}
          onClick={() => handleOpenChange(false)}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="h-10 rounded-lg bg-destructive px-5 text-white hover:bg-destructive/90"
          disabled={deleteIssueMutation.isPending}
          onClick={() => void handleDelete()}
          type="button"
        >
          {deleteIssueMutation.isPending ? (
            <SpinnerGapIcon
              aria-hidden="true"
              className="animate-spin"
              size={17}
              weight="bold"
            />
          ) : (
            <TrashIcon aria-hidden="true" size={17} weight="bold" />
          )}
          {deleteIssueMutation.isPending ? "Deleting issue..." : "Delete issue"}
        </Button>
      </footer>
    </Modal>
  );
}
