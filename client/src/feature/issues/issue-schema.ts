import { z } from "zod";

import { issuePriorities, issueStatuses } from "@/feature/issues/types";

export const createIssueFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must contain at least 2 characters")
    .max(150, "Title cannot exceed 150 characters"),
  description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters"),
  status: z.enum(issueStatuses),
  priority: z.enum(issuePriorities),
  assigneeId: z.string().min(1, "Choose an assignee or leave it unassigned"),
  dueDate: z
    .string()
    .refine(
      (value) => value.length === 0 || /^\d{4}-\d{2}-\d{2}$/.test(value),
      "Choose a valid due date",
    ),
});

export type CreateIssueFormValues = z.infer<typeof createIssueFormSchema>;

export const changeIssueAssigneeSchema = z.object({
  assigneeId: z.string().min(1, "Choose an assignee or leave it unassigned"),
});

export type ChangeIssueAssigneeValues = z.infer<
  typeof changeIssueAssigneeSchema
>;

export const editIssueFormSchema = createIssueFormSchema.pick({
  title: true,
  description: true,
  priority: true,
  dueDate: true,
});

export type EditIssueFormValues = z.infer<typeof editIssueFormSchema>;
