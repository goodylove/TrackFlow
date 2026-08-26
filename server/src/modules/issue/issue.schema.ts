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
      .nullable(),

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

export const updateIssueSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(2).max(150).optional(),

      description: z.string().trim().max(5000).optional(),

      status: z.enum(ISSUE_STATUSES).optional(),

      priority: z.enum(ISSUE_PRIORITIES).optional(),

      dueDate: z
        .string()
        .datetime("Due date must be a valid ISO date")
        .transform((value) => new Date(value))
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field must be provided",
    ),
});

export type UpdateIssueInput = z.infer<typeof updateIssueSchema>["body"];

export const getIssuesSchema = z.object({
  query: z.object({
    search: z
      .string()
      .trim()
      .min(1, "Title search cannot be empty")
      .max(150, "Title search cannot exceed 150 characters")
      .optional(),

    status: z.enum(ISSUE_STATUSES).optional(),

    priority: z.enum(ISSUE_PRIORITIES).optional(),

    assigneeId: z
      .string()
      .refine((value) => Types.ObjectId.isValid(value), "Invalid assignee ID")
      .optional(),
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type GetIssuesInput = z.infer<typeof getIssuesSchema>["query"];
