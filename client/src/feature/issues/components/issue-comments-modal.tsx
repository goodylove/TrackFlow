import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChatCircleIcon,
  PaperPlaneTiltIcon,
  PencilSimpleIcon,
  SpinnerGapIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "@/components/ui/toaster";

import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { DeleteCommentModal } from "@/feature/issues/components/delete-comment-modal";
import {
  createCommentFormSchema,
  type CreateCommentFormValues,
} from "@/feature/issues/comment-schema";
import {
  type IssueComment,
  useCreateIssueCommentService,
  useIssueCommentsService,
  useUpdateIssueCommentService,
} from "@/feature/issues/services/comment-service";
import type { Issue } from "@/feature/issues/types";
import { ApiError } from "@/lib/api/api-error";

type IssueCommentsModalProps = {
  currentUserId: string;
  issue: Issue;
  onCommentCreated: (issueId: string) => void;
  onCommentDeleted: (issueId: string) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  workspaceId: string;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    // dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type CommentItemProps = {
  comment: IssueComment;
  currentUserId: string;
  issueId: string;
  onDeleteRequested: (comment: IssueComment) => void;
  workspaceId: string;
};

function CommentItem({
  comment,
  currentUserId,
  issueId,
  onDeleteRequested,
  workspaceId,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateCommentMutation = useUpdateIssueCommentService(
    workspaceId,
    issueId,
  );
  const form = useForm<CreateCommentFormValues>({
    defaultValues: { content: comment.content },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(createCommentFormSchema),
  });
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setError,
    watch,
  } = form;
  const contentLength = watch("content").length;
  const isPending = isSubmitting || updateCommentMutation.isPending;
  const isAuthor = comment.author.id === currentUserId;

  function cancelEditing() {
    if (isPending) return;
    reset({ content: comment.content });
    updateCommentMutation.reset();
    setIsEditing(false);
  }

  const onSubmit: SubmitHandler<CreateCommentFormValues> = async (values) => {
    clearErrors();

    try {
      const updatedComment = await updateCommentMutation.mutateAsync({
        commentId: comment.id,
        content: values.content,
      });
      reset({ content: updatedComment.content });
      setIsEditing(false);
      toast.success("Comment updated");
    } catch (submissionError) {
      if (submissionError instanceof ApiError) {
        const contentMessage = submissionError.fieldErrors?.content;
        if (contentMessage) {
          setError("content", { message: contentMessage, type: "server" });
          return;
        }

        setError("root", {
          message:
            submissionError.fieldErrors?.body ?? submissionError.message,
        });
        return;
      }

      setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <li className="flex items-center gap-2">
      <Avatar className="size-9">
        {comment.author.avatarUrl ? (
          <AvatarImage alt="" src={comment.author.avatarUrl} />
        ) : null}
        <AvatarFallback className="bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]">
          {getInitials(comment.author.name)}
        </AvatarFallback>
      </Avatar>
      <article className="min-w-0 flex-1 bg-white px-4 py-3">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <p className="truncate text-sm font-bold text-foreground">
              {comment.author.name}
            </p>
            {comment.updatedAt !== comment.createdAt ? (
              <span className="text-[0.68rem] text-muted-foreground">
                edited
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <time
              className="text-[0.68rem] font-medium text-muted-foreground"
              dateTime={comment.createdAt}
            >
              {formatCommentDate(comment.createdAt)}
            </time>
            {isAuthor && !isEditing ? (
              <div className="flex items-center gap-1">
                <Button
                  aria-label="Edit your comment"
                  className="h-7 rounded-md px-2 text-xs text-muted-foreground"
                  onClick={() => setIsEditing(true)}
                  type="button"
                  variant="ghost"
                >
                  <PencilSimpleIcon aria-hidden="true" size={14} />
                  Edit
                </Button>
                <Button
                  aria-label="Delete your comment"
                  className="h-7 rounded-md px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDeleteRequested(comment)}
                  type="button"
                  variant="ghost"
                >
                  <TrashIcon aria-hidden="true" size={14} />
                  Delete
                </Button>
              </div>
            ) : null}
          </div>
        </header>

        {isEditing ? (
          <Form {...form}>
            <form
              className="mt-3 space-y-3"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              {errors.root?.message ? (
                <Alert role="alert" variant="destructive">
                  {errors.root.message}
                </Alert>
              ) : null}
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-3">
                      <FormLabel className="sr-only">Edit comment</FormLabel>
                      <span className="ml-auto text-[0.68rem] text-muted-foreground">
                        {contentLength}/5000
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        autoFocus
                        className="min-h-20 bg-white"
                        disabled={isPending}
                        maxLength={5000}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  className="h-8 rounded-md px-3 text-xs"
                  disabled={isPending}
                  onClick={cancelEditing}
                  type="button"
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  className="h-8 rounded-md bg-[var(--marketing-action)] px-3 text-xs text-white hover:bg-[var(--marketing-action-strong)]"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? (
                    <SpinnerGapIcon
                      aria-hidden="true"
                      className="animate-spin"
                      size={14}
                      weight="bold"
                    />
                  ) : null}
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground/85">
            {comment.content}
          </p>
        )}
      </article>
    </li>
  );
}

export function IssueCommentsModal({
  currentUserId,
  issue,
  onCommentCreated,
  onCommentDeleted,
  onOpenChange,
  open,
  workspaceId,
}: IssueCommentsModalProps) {
  const [commentToDelete, setCommentToDelete] =
    useState<IssueComment | null>(null);
  const commentsQuery = useIssueCommentsService(workspaceId, issue.id);
  const createCommentMutation = useCreateIssueCommentService(
    workspaceId,
    issue.id,
  );
  const form = useForm<CreateCommentFormValues>({
    defaultValues: { content: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(createCommentFormSchema),
  });
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setError,
    watch,
  } = form;
  const contentLength = watch("content").length;
  const isCreating = isSubmitting || createCommentMutation.isPending;
  const comments =
    commentsQuery.data?.pages.flatMap((page) => page.comments) ?? [];
  const totalComments =
    commentsQuery.data?.pages[0]?.pagination.totalComments ?? issue.commentCount;
  const errorMessage = commentsQuery.error
    ? commentsQuery.error instanceof ApiError
      ? commentsQuery.error.message
      : "Something went wrong. Please try again."
    : null;

  function handleOpenChange(nextOpen: boolean) {
    if (isCreating) return;
    if (!nextOpen) {
      reset();
      createCommentMutation.reset();
    }
    onOpenChange(nextOpen);
  }

  const onSubmit: SubmitHandler<CreateCommentFormValues> = async (values) => {
    clearErrors();

    try {
      await createCommentMutation.mutateAsync(values.content);
      reset();
      onCommentCreated(issue.id);
      toast.success("Comment added", {
        description: `Your comment was added to ${issue.identifier}.`,
      });
    } catch (submissionError) {
      if (submissionError instanceof ApiError) {
        const contentMessage = submissionError.fieldErrors?.content;
        if (contentMessage) {
          setError("content", { message: contentMessage, type: "server" });
          return;
        }

        setError("root", {
          message:
            submissionError.fieldErrors?.body ?? submissionError.message,
        });
        return;
      }

      setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      <Modal
        className="max-w-2xl"
        description={
          <>
            <p className="text-sm font-normal leading-6 text-foreground/85">
              {issue.description ?? ""}
            </p>
            <p>
              {issue.identifier} - {totalComments}{" "}
              {totalComments === 1 ? "comment" : "comments"}
            </p>
          </>
        }
        // icon={<ChatCircleIcon aria-hidden="true" size={22} weight="fill" />}
        onOpenChange={handleOpenChange}
        open={open}
        preventClose={isCreating}
        title={issue?.title}
      >
      {/* <div className="border-b border-[var(--marketing-border)] bg-muted/20 px-5 py-4 sm:px-6">
        <p className="text-lg font-bold leading-6 text-foreground">
          {issue.title}
        </p>
        <p className="text-sm font-normal leading-6 text-foreground/85">
          {issue.description ?? ""}
        </p>
      </div> */}

      <div className="min-h-56 px-5 py-5 sm:px-6">
        {commentsQuery.isPending ? (
          <div
            className="flex min-h-44 flex-col items-center justify-center gap-3 text-sm text-muted-foreground"
            role="status"
          >
            <SpinnerGapIcon
              aria-hidden="true"
              className="animate-spin text-[var(--marketing-action)]"
              size={24}
              weight="bold"
            />
            Loading comments...
          </div>
        ) : errorMessage ? (
          <div className="space-y-4">
            <Alert
              className="flex items-start gap-3"
              role="alert"
              variant="destructive"
            >
              <WarningCircleIcon
                aria-hidden="true"
                className="mt-0.5 shrink-0"
                size={18}
                weight="fill"
              />
              <span>{errorMessage}</span>
            </Alert>
            <Button
              className="h-10 rounded-lg"
              disabled={commentsQuery.isFetching}
              onClick={() => void commentsQuery.refetch()}
              type="button"
              variant="outline"
            >
              {commentsQuery.isFetching ? (
                <SpinnerGapIcon
                  aria-hidden="true"
                  className="animate-spin"
                  size={16}
                  weight="bold"
                />
              ) : null}
              {commentsQuery.isFetching ? "Trying again..." : "Try again"}
            </Button>
          </div>
        ) : comments.length === 0 ? (
          <div className="grid min-h-44 place-items-center rounded-xl border border-dashed border-[var(--marketing-border)] bg-muted/15 px-5 text-center">
            <div>
              <ChatCircleIcon
                aria-hidden="true"
                className="mx-auto text-muted-foreground"
                size={26}
              />
              <p className="mt-3 text-sm font-bold">No comments yet</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Comments added to this issue will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ol className="space-y-4" aria-label="Issue comments">
              {comments.map((comment) => (
                <CommentItem
                  comment={comment}
                  currentUserId={currentUserId}
                  issueId={issue.id}
                  key={comment.id}
                  onDeleteRequested={setCommentToDelete}
                  workspaceId={workspaceId}
                />
              ))}
            </ol>

            {commentsQuery.hasNextPage ? (
              <Button
                className="h-10 w-full rounded-lg"
                disabled={commentsQuery.isFetchingNextPage}
                onClick={() => void commentsQuery.fetchNextPage()}
                type="button"
                variant="outline"
              >
                {commentsQuery.isFetchingNextPage ? (
                  <SpinnerGapIcon
                    aria-hidden="true"
                    className="animate-spin"
                    size={16}
                    weight="bold"
                  />
                ) : null}
                {commentsQuery.isFetchingNextPage
                  ? "Loading more..."
                  : `Load more comments (${Math.max(totalComments - comments.length, 0)})`}
              </Button>
            ) : null}
          </div>
        )}
      </div>

      <Form {...form}>
        <form
          className="border-t border-[var(--marketing-border)] bg-muted/20 px-5 py-4 sm:px-6"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-3">
            {errors.root?.message ? (
              <Alert role="alert" variant="destructive">
                {errors.root.message}
              </Alert>
            ) : null}

            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-3">
                    <FormLabel className="text-sm font-bold">
                      Add a comment
                    </FormLabel>
                    <span className="text-[0.68rem] text-muted-foreground">
                      {contentLength}/5000
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      className="min-h-24 bg-white"
                      disabled={isCreating}
                      maxLength={5000}
                      placeholder="Share an update, question, or decision..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                className="h-10 rounded-lg bg-[var(--marketing-action)] px-4 text-white hover:bg-[var(--marketing-action-strong)]"
                disabled={isCreating}
                type="submit"
              >
                {isCreating ? (
                  <SpinnerGapIcon
                    aria-hidden="true"
                    className="animate-spin"
                    size={16}
                    weight="bold"
                  />
                ) : (
                  <PaperPlaneTiltIcon
                    aria-hidden="true"
                    size={16}
                    weight="bold"
                  />
                )}
                {isCreating ? "Posting..." : "Post comment"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      </Modal>

      {commentToDelete ? (
        <DeleteCommentModal
          comment={commentToDelete}
          issueId={issue.id}
          issueIdentifier={issue.identifier}
          onDeleted={() => {
            onCommentDeleted(issue.id);
            setCommentToDelete(null);
          }}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setCommentToDelete(null);
          }}
          open
          workspaceId={workspaceId}
        />
      ) : null}
    </>
  );
}
