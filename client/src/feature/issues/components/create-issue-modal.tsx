import { zodResolver } from "@hookform/resolvers/zod";
import { ListPlusIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useWorkspaceMembersService,
  type WorkspaceMember,
} from "@/feature/dashboard/services/workspace-service";
import {
  createIssueFormSchema,
  type CreateIssueFormValues,
} from "@/feature/issues/issue-schema";
import {
  toBoardIssue,
  useCreateIssueService,
} from "@/feature/issues/services/issue-service";
import {
  issuePriorities,
  issuePriorityLabels,
  issueStatuses,
  issueStatusLabels,
  type Issue,
} from "@/feature/issues/types";
import { ApiError } from "@/lib/api/api-error";

type CreateIssueModalProps = {
  currentUserId: string;
  onCreated: (issue: Issue) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  workspaceId: string;
  workspaceName: string;
};

const defaultValues: CreateIssueFormValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assigneeId: "unassigned",
  dueDate: "",
};

const formFields = [
  "title",
  "description",
  "status",
  "priority",
  "assigneeId",
  "dueDate",
] as const;

export function CreateIssueModal({
  currentUserId,
  onCreated,
  onOpenChange,
  open,
  workspaceId,
  workspaceName,
}: CreateIssueModalProps) {
  const createIssueMutation = useCreateIssueService(workspaceId);
  const membersQuery = useWorkspaceMembersService(currentUserId, workspaceId);
  const members = membersQuery.data ?? [];
  const form = useForm<CreateIssueFormValues>({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(createIssueFormSchema),
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
  const descriptionLength = watch("description").length;
  const isPending = isSubmitting || createIssueMutation.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    if (!nextOpen) {
      reset(defaultValues);
      createIssueMutation.reset();
    }
    onOpenChange(nextOpen);
  }

  const onSubmit: SubmitHandler<CreateIssueFormValues> = async (values) => {
    clearErrors();

    try {
      const selectedMembership = members.find(
        ({ user }) => user._id === values.assigneeId,
      );
      const issue = await createIssueMutation.mutateAsync({
        title: values.title,
        ...(values.description ? { description: values.description } : {}),
        status: values.status,
        priority: values.priority,
        assigneeId:
          values.assigneeId === "unassigned" ? null : values.assigneeId,
        ...(values.dueDate
          ? { dueDate: `${values.dueDate}T12:00:00.000Z` }
          : {}),
      });

      const boardIssue = toBoardIssue(issue, selectedMembership?.user);
      onCreated(boardIssue);
      reset(defaultValues);
      onOpenChange(false);
      toast.success("Issue created", {
        description: `${boardIssue.identifier} was added to ${issueStatusLabels[boardIssue.status]}.`,
      });
    } catch (submissionError) {
      if (submissionError instanceof ApiError) {
        let hasFieldError = false;

        formFields.forEach((field) => {
          const message = submissionError.fieldErrors?.[field];
          if (message) {
            setError(field, { message, type: "server" });
            hasFieldError = true;
          }
        });

        if (
          submissionError.status === 400 &&
          submissionError.message.toLowerCase().includes("assignee")
        ) {
          setError("assigneeId", {
            message: submissionError.message,
            type: "server",
          });
          return;
        }

        if (hasFieldError) return;

        const nestedValidationMessage = submissionError.fieldErrors?.body;
        setError("root", {
          message: nestedValidationMessage ?? submissionError.message,
        });
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
      "Select assignee"
    );
  }

  return (
    <Modal
      className="max-w-2xl"
      description={`Add work to ${workspaceName} and place it in the right stage.`}
      icon={<ListPlusIcon aria-hidden="true" size={22} weight="fill" />}
      onOpenChange={handleOpenChange}
      open={open}
      preventClose={isPending}
      title="Create issue"
    >
      <Form {...form}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 px-5 py-6 sm:px-6">
            {errors.root?.message ? (
              <Alert role="alert" variant="destructive">
                {errors.root.message}
              </Alert>
            ) : null}

            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-3">
                    <FormLabel className="text-sm font-bold">
                      Issue title
                    </FormLabel>
                    <span className="text-[0.68rem] text-muted-foreground">
                      {field.value.length}/150
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      autoFocus
                      className="h-11 rounded-lg border-[var(--marketing-border)] bg-white px-3 text-sm focus-visible:border-[var(--marketing-action)] focus-visible:ring-[var(--marketing-action)]/15 md:text-sm"
                      disabled={isPending}
                      maxLength={150}
                      placeholder="What needs to be done?"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Keep it specific enough for the team to scan quickly.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-3">
                    <FormLabel className="text-sm font-bold">
                      Description
                      <span className="ml-1 font-normal text-muted-foreground">
                        Optional
                      </span>
                    </FormLabel>
                    <span className="text-[0.68rem] text-muted-foreground">
                      {descriptionLength}/5000
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      maxLength={5000}
                      placeholder="Add context, expected behavior, or acceptance notes."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold">Status</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue>
                            {issueStatusLabels[field.value]}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issueStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {issueStatusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold">
                      Priority
                    </FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue>
                            {issuePriorityLabels[field.value]}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issuePriorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {issuePriorityLabels[priority]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold">
                      Assignee
                    </FormLabel>
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
                        {members.map((membership: WorkspaceMember) => (
                          <SelectItem
                            key={membership.user._id}
                            value={membership.user._id}
                          >
                            {membership.user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {membersQuery.isError ? (
                      <FormDescription className="text-amber-700">
                        Members could not be loaded. You can still create this
                        issue unassigned.
                      </FormDescription>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold">
                      Due date
                      <span className="ml-1 font-normal text-muted-foreground">
                        Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 rounded-lg border-[var(--marketing-border)] bg-white px-3 text-sm focus-visible:border-[var(--marketing-action)] focus-visible:ring-[var(--marketing-action)]/15 md:text-sm"
                        disabled={isPending}
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              disabled={isPending}
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
                <ListPlusIcon aria-hidden="true" size={17} weight="bold" />
              )}
              {isPending ? "Creating issue..." : "Create issue"}
            </Button>
          </footer>
        </form>
      </Form>
    </Modal>
  );
}
