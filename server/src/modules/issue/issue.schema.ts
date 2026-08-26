import { z } from "zod";

import { ISSUE_PRIORITIES, ISSUE_STATUSES } from "./issue.modal.js";
import { Types } from "mongoose";

export const createIssueSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2, "Title must contain at least 2 characters")
      .max(150, "Title cannot exceed 150 characters"),

    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters")
      .optional(),

    status: z.enum(ISSUE_STATUSES).default("todo"),

    priority: z.enum(ISSUE_PRIORITIES).default("medium"),

    assigneeId: z
      .string()
      .refine((value) => Types.ObjectId.isValid(value), "Invalid assignee ID")
      .optional(),

    dueDate: z.coerce.date().optional(),
  }),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>["body"];

export const setIssueAssigneeSchema = z.object({
  body: z.object({
    assigneeId: z
      .string()
      .refine((value) => Types.ObjectId.isValid(value), "Invalid assignee ID"),
  }),
});

export type setIssueAssigneeInput = z.infer<typeof setIssueAssigneeSchema>["body"];