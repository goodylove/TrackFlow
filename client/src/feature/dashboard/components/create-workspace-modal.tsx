import { zodResolver } from "@hookform/resolvers/zod";
import { BuildingsIcon, SpinnerGapIcon } from "@phosphor-icons/react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  type CreatedWorkspace,
  useCreateWorkspaceService,
} from "@/feature/dashboard/services/workspace-service";
import {
  createWorkspaceSchema,
  type CreateWorkspaceValues,
} from "@/feature/dashboard/workspace-schema";
import { ApiError } from "@/lib/api/api-error";

type CreateWorkspaceModalProps = {
  onCreated: (workspace: CreatedWorkspace) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const defaultValues: CreateWorkspaceValues = {
  name: "",
  description: "",
};

export function CreateWorkspaceModal({
  onCreated,
  onOpenChange,
  open,
}: CreateWorkspaceModalProps) {
  const createWorkspaceMutation = useCreateWorkspaceService();
  const form = useForm<CreateWorkspaceValues>({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(createWorkspaceSchema),
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
  const isPending = isSubmitting || createWorkspaceMutation.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    if (!nextOpen) {
      reset(defaultValues);
      createWorkspaceMutation.reset();
    }
    onOpenChange(nextOpen);
  }

  const onSubmit: SubmitHandler<CreateWorkspaceValues> = async (values) => {
    clearErrors();

    try {
      const workspace = await createWorkspaceMutation.mutateAsync(values);
      onCreated(workspace);
      reset(defaultValues);
      onOpenChange(false);
      toast.success("Workspace created", {
        description: `${workspace.name} is ready for your team.`,
      });
    } catch (submissionError) {
      if (submissionError instanceof ApiError && submissionError.fieldErrors) {
        (["name", "description"] as const).forEach((field) => {
          const message = submissionError.fieldErrors?.[field];
          if (message) setError(field, { message, type: "server" });
        });

        if (Object.keys(submissionError.fieldErrors).length > 0) return;
      }

      setError("root", {
        message:
          submissionError instanceof ApiError
            ? submissionError.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Modal
      description="Give your team a shared place to organize and track work."
      icon={<BuildingsIcon aria-hidden="true" size={22} weight="fill" />}
      onOpenChange={handleOpenChange}
      open={open}
      preventClose={isPending}
      title="Create workspace"
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-foreground">
                    Workspace name
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="organization"
                      className="h-11 rounded-lg border-[var(--marketing-border)] bg-white px-3 text-sm focus:border-[var(--marketing-action)] focus:ring-[var(--marketing-action)]/15"
                      disabled={isPending}
                      maxLength={80}
                      placeholder="e.g. Product team"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use a clear name your teammates will recognize.
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
                    <FormLabel className="text-sm font-bold text-foreground">
                      Description
                      <span className="font-normal text-muted-foreground">
                        Optional
                      </span>
                    </FormLabel>
                    <span className="text-[0.68rem] text-muted-foreground">
                      {descriptionLength}/300
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      maxLength={300}
                      placeholder="What will your team manage here?"
                      {...field}
                    />
                  </FormControl>
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
              className="h-10 rounded-lg bg-[var(--marketing-action)] px-5 hover:bg-[var(--marketing-action)]/90"
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
              ) : null}
              {isPending ? "Creating workspace..." : "Create workspace"}
            </Button>
          </footer>
        </form>
      </Form>
    </Modal>
  );
}
