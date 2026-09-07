import { zodResolver } from "@hookform/resolvers/zod";
import { PencilSimpleIcon, SpinnerGapIcon } from "@phosphor-icons/react";
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
  editIssueFormSchema,
  type EditIssueFormValues,
} from "@/feature/issues/issue-schema";
import { useUpdateIssueDetailsService } from "@/feature/issues/services/issue-service";
import {
  issuePriorities,
  issuePriorityLabels,
  type Issue,
  type IssuePriority,
} from "@/feature/issues/types";
import { ApiError } from "@/lib/api/api-error";

type UpdatedIssueDetails = {
  description?: string;
  dueDate?: string;
  priority: IssuePriority;
  title: string;
  updatedAt: string;
};

type EditIssueModalProps = {
  issue: Issue;
  onOpenChange: (open: boolean) => void;
  onUpdated: (issueId: string, details: UpdatedIssueDetails) => void;
  open: boolean;
  workspaceId: string;
};

const formFields = ["title", "description", "priority", "dueDate"] as const;

export function EditIssueModal({
  issue,
  onOpenChange,
  onUpdated,
  open,
  workspaceId,
}: EditIssueModalProps) {
  const updateIssueMutation = useUpdateIssueDetailsService(workspaceId);
  const form = useForm<EditIssueFormValues>({
    defaultValues: {
      title: issue.title,
      description: issue.description ?? "",
      priority: issue.priority,
      dueDate: issue.dueDate ?? "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(editIssueFormSchema),
  });
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    watch,
  } = form;
  const descriptionLength = watch("description").length;
  const isPending = isSubmitting || updateIssueMutation.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    if (!nextOpen) updateIssueMutation.reset();
    onOpenChange(nextOpen);
  }

  const onSubmit: SubmitHandler<EditIssueFormValues> = async (values) => {
    clearErrors();

    try {
      const updatedIssue = await updateIssueMutation.mutateAsync({
        issueId: issue.id,
        title: values.title,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate
          ? `${values.dueDate}T12:00:00.000Z`
          : null,
      });

      onUpdated(issue.id, updatedIssue);
      onOpenChange(false);
      toast.success("Issue updated", {
        description: `${issue.identifier} details were saved.`,
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

        if (hasFieldError) return;

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
    <Modal
      className="max-w-2xl"
      description={`Update the details for ${issue.identifier}. Status and assignee remain unchanged.`}
      icon={<PencilSimpleIcon aria-hidden="true" size={22} weight="fill" />}
      onOpenChange={handleOpenChange}
      open={open}
      preventClose={isPending}
      title="Edit issue"
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
                    <FormDescription>
                      Clear the field to remove the due date.
                    </FormDescription>
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
                <PencilSimpleIcon aria-hidden="true" size={17} weight="bold" />
              )}
              {isPending ? "Saving changes..." : "Save changes"}
            </Button>
          </footer>
        </form>
      </Form>
    </Modal>
  );
}
