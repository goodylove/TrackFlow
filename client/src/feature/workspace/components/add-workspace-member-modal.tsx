// Provides a permission-aware member form backed by the workspace member mutation.
import { zodResolver } from "@hookform/resolvers/zod";
import { SpinnerGapIcon, UserPlusIcon } from "@phosphor-icons/react";
import { useForm, type SubmitHandler } from "react-hook-form";

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
import { useAddWorkspaceMemberService } from "@/feature/dashboard/services/workspace-service";
import {
  addWorkspaceMemberSchema,
  type AddWorkspaceMemberValues,
} from "@/feature/workspace/workspace-member-schema";
import { ApiError } from "@/lib/api/api-error";

type AddWorkspaceMemberModalProps = {
  actorRole: "owner" | "admin";
  onAdded: (email: string) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  userId: string;
  workspaceId: string;
  workspaceName: string;
};

const defaultValues: AddWorkspaceMemberValues = {
  email: "",
  role: "member",
};

export function AddWorkspaceMemberModal({
  actorRole,
  onAdded,
  onOpenChange,
  open,
  userId,
  workspaceId,
  workspaceName,
}: AddWorkspaceMemberModalProps) {
  const addMemberMutation = useAddWorkspaceMemberService(userId, workspaceId);
  const form = useForm<AddWorkspaceMemberValues>({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(addWorkspaceMemberSchema),
  });
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setError,
  } = form;
  const isPending = isSubmitting || addMemberMutation.isPending;

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    if (!nextOpen) {
      reset(defaultValues);
      addMemberMutation.reset();
    }
    onOpenChange(nextOpen);
  }

  const onSubmit: SubmitHandler<AddWorkspaceMemberValues> = async (values) => {
    clearErrors();

    try {
      await addMemberMutation.mutateAsync(values);
      reset(defaultValues);
      onOpenChange(false);
      onAdded(values.email);
    } catch (submissionError) {
      if (submissionError instanceof ApiError) {
        const emailMessage = submissionError.fieldErrors?.email;
        if (emailMessage || submissionError.status === 404 || submissionError.status === 409) {
          setError("email", {
            message: emailMessage ?? submissionError.message,
            type: "server",
          });
          return;
        }

        const roleMessage = submissionError.fieldErrors?.role;
        if (roleMessage) {
          setError("role", { message: roleMessage, type: "server" });
          return;
        }
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
      description={`Give an existing TrackFlow user access to ${workspaceName}.`}
      icon={<UserPlusIcon aria-hidden="true" size={22} weight="fill" />}
      onOpenChange={handleOpenChange}
      open={open}
      preventClose={isPending}
      title="Add workspace member"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">Email address</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="email"
                      className="h-11 rounded-lg border-[var(--marketing-border)] bg-white px-3 text-sm focus:border-[var(--marketing-action)] focus:ring-[var(--marketing-action)]/15"
                      disabled={isPending}
                      placeholder="teammate@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    They must already have a TrackFlow account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">Workspace role</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue>
                          {field.value === "admin" ? "Admin" : "Member"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      {actorRole === "owner" ? (
                        <SelectItem value="admin">Admin</SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {actorRole === "owner"
                      ? "Admins can manage members. Members can collaborate on workspace issues."
                      : "Admins can add members; only the owner can assign admin access."}
                  </FormDescription>
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
                <SpinnerGapIcon aria-hidden="true" className="animate-spin" size={17} weight="bold" />
              ) : (
                <UserPlusIcon aria-hidden="true" size={17} weight="bold" />
              )}
              {isPending ? "Adding member..." : "Add member"}
            </Button>
          </footer>
        </form>
      </Form>
    </Modal>
  );
}
