import { zodResolver } from "@hookform/resolvers/zod";
import { SpinnerGapIcon, UserSwitchIcon } from "@phosphor-icons/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "@/components/ui/toaster";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceMembersService } from "@/feature/dashboard/services/workspace-service";
import {
  changeIssueAssigneeSchema,
  type ChangeIssueAssigneeValues,
} from "@/feature/issues/issue-schema";
import { useSetIssueAssigneeService } from "@/feature/issues/services/issue-service";
import type { Issue, IssueAssignee } from "@/feature/issues/types";
import { ApiError } from "@/lib/api/api-error";

type ChangeIssueAssigneeModalProps = {
  currentUserId: string;
  issue: Issue;
  onChanged: (
    issueId: string,
    assignee: IssueAssignee | null,
    updatedAt: string,
  ) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  workspaceId: string;
};

export function ChangeIssueAssigneeModal({
  currentUserId,
  issue,
  onChanged,
  onOpenChange,
  open,
  workspaceId,
}: ChangeIssueAssigneeModalProps) {
  const membersQuery = useWorkspaceMembersService(currentUserId, workspaceId);
  const setAssigneeMutation = useSetIssueAssigneeService(workspaceId);
  const members = membersQuery.data ?? [];
  const form = useForm<ChangeIssueAssigneeValues>({
    defaultValues: {
      assigneeId: issue.assignee?.id ?? "unassigned",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(changeIssueAssigneeSchema),
  });
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = form;
  const isPending = isSubmitting || setAssigneeMutation.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    if (!nextOpen) setAssigneeMutation.reset();
    onOpenChange(nextOpen);
  }

  const onSubmit: SubmitHandler<ChangeIssueAssigneeValues> = async (values) => {
    clearErrors();

    try {
      const result = await setAssigneeMutation.mutateAsync({
        issueId: issue.id,
        assigneeId:
          values.assigneeId === "unassigned" ? null : values.assigneeId,
      });

      onChanged(issue.id, result.assignee, result.updatedAt);
      onOpenChange(false);
      toast.success(result.assignee ? "Assignee updated" : "Issue unassigned", {
        description: result.assignee
          ? `${result.assignee.name} is now responsible for ${issue.identifier}.`
          : `${issue.identifier} is ready for someone to pick up.`,
      });
    } catch (submissionError) {
      if (submissionError instanceof ApiError) {
        const assigneeMessage = submissionError.fieldErrors?.assigneeId;
        if (
          assigneeMessage ||
          (submissionError.status === 400 &&
            submissionError.message.toLowerCase().includes("assignee"))
        ) {
          setError("assigneeId", {
            message: assigneeMessage ?? submissionError.message,
            type: "server",
          });
          return;
        }

        setError("root", { message: submissionError.message });
        return;
      }

      setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  };

  function getAssigneeLabel(value: string) {
    if (value === "unassigned") return "Unassigned";
    return (
      members.find(({ user }) => user._id === value)?.user.name ??
      issue.assignee?.name ??
      "Select assignee"
    );
  }

  return (
    <Modal
      description={`Choose who is responsible for ${issue.identifier}.`}
      icon={<UserSwitchIcon aria-hidden="true" size={22} weight="fill" />}
      onOpenChange={handleOpenChange}
      open={open}
      preventClose={isPending}
      title="Change assignee"
    >
      <Form {...form}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 px-5 py-6 sm:px-6">
            {errors.root?.message ? (
              <Alert role="alert" variant="destructive">
                {errors.root.message}
              </Alert>
            ) : null}

            <div className="rounded-xl border border-[var(--marketing-border)] bg-muted/25 p-4">
              <p className="font-mono text-[0.68rem] font-bold tracking-wide text-muted-foreground">
                {issue.identifier}
              </p>
              <p className="mt-1 text-sm font-bold leading-6 text-foreground">
                {issue.title}
              </p>
            </div>

            <FormField
              control={control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">Assignee</FormLabel>
                  <Select
                    disabled={isPending || membersQuery.isPending}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue>
                          {membersQuery.isPending
                            ? "Loading members..."
                            : getAssigneeLabel(field.value)}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {members.map(({ user }) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Only members of this workspace can be assigned.
                  </FormDescription>
                  {membersQuery.isError ? (
                    <p className="text-xs text-amber-700" role="status">
                      Members could not be loaded. You can still remove the
                      current assignee.
                    </p>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <footer className="flex flex-col-reverse gap-2 border-t border-[var(--marketing-border)] bg-muted/20 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              className="h-10 rounded-lg"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="h-10 rounded-lg bg-[var(--marketing-action)] px-5 text-white hover:bg-[var(--marketing-action-strong)]"
              disabled={isPending || membersQuery.isPending}
              type="submit"
            >
              {isPending ? (
                <SpinnerGapIcon
                  aria-hidden="true"
                  className="animate-spin"
                  size={17}
                  weight="bold"
                />
              ) : (
                <UserSwitchIcon aria-hidden="true" size={17} weight="bold" />
              )}
              {isPending ? "Saving assignee..." : "Save assignee"}
            </Button>
          </footer>
        </form>
      </Form>
    </Modal>
  );
}
