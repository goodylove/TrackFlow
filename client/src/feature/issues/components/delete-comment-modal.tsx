import { SpinnerGapIcon, TrashIcon, WarningIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  type IssueComment,
  useDeleteIssueCommentService,
} from "@/feature/issues/services/comment-service";
import { ApiError } from "@/lib/api/api-error";

type DeleteCommentModalProps = {
  comment: IssueComment;
  issueId: string;
  issueIdentifier: string;
  onDeleted: (commentId: string) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  workspaceId: string;
};

export function DeleteCommentModal({
  comment,
  issueId,
  issueIdentifier,
  onDeleted,
  onOpenChange,
  open,
  workspaceId,
}: DeleteCommentModalProps) {
  const deleteCommentMutation = useDeleteIssueCommentService(
    workspaceId,
    issueId,
  );

  function handleOpenChange(nextOpen: boolean) {
    if (deleteCommentMutation.isPending) return;
    if (!nextOpen) deleteCommentMutation.reset();
    onOpenChange(nextOpen);
  }

  async function handleDelete() {
    if (deleteCommentMutation.isPending) return;

    try {
      await deleteCommentMutation.mutateAsync(comment.id);
      onDeleted(comment.id);
      onOpenChange(false);
      toast.success("Comment deleted", {
        description: `Your comment was removed from ${issueIdentifier}.`,
      });
    } catch {
      // The mutation error remains visible in the confirmation modal for retry.
    }
  }

  const errorMessage = deleteCommentMutation.error
    ? deleteCommentMutation.error instanceof ApiError
      ? deleteCommentMutation.error.message
      : "Something went wrong. Please try again."
    : null;

  return (
    <Modal
      description={`Permanently remove your comment from ${issueIdentifier}.`}
      icon={<TrashIcon aria-hidden="true" size={21} weight="fill" />}
      onOpenChange={handleOpenChange}
      open={open}
      preventClose={deleteCommentMutation.isPending}
      title="Delete comment"
    >
      <div className="space-y-5 px-5 py-6 sm:px-6">
        <div className="rounded-xl border border-[var(--marketing-border)] bg-muted/25 p-4">
          <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6 text-foreground/85">
            {comment.content}
          </p>
        </div>

        <Alert className="flex items-start gap-3" variant="destructive">
          <WarningIcon
            aria-hidden="true"
            className="mt-0.5 shrink-0"
            size={18}
            weight="fill"
          />
          <span>This action cannot be undone.</span>
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
          disabled={deleteCommentMutation.isPending}
          onClick={() => handleOpenChange(false)}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          className="h-10 rounded-lg bg-destructive px-5 text-white hover:bg-destructive/90"
          disabled={deleteCommentMutation.isPending}
          onClick={() => void handleDelete()}
          type="button"
        >
          {deleteCommentMutation.isPending ? (
            <SpinnerGapIcon
              aria-hidden="true"
              className="animate-spin"
              size={17}
              weight="bold"
            />
          ) : (
            <TrashIcon aria-hidden="true" size={17} weight="bold" />
          )}
          {deleteCommentMutation.isPending
            ? "Deleting comment..."
            : "Delete comment"}
        </Button>
      </footer>
    </Modal>
  );
}
