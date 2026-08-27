import { z } from "zod";

const commentContentSchema = z
  .string()
  .trim()
  .min(1, "Comment content is required")
  .max(5000, "Comment content cannot exceed 5000 characters");

export const createCommentSchema = z.object({
  body: z.object({
    content: commentContentSchema,
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];

export const updateCommentSchema = z.object({
  body: z.object({
    content: commentContentSchema,
  }),
});

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>["body"];

export const getCommentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export type GetCommentsInput = z.infer<typeof getCommentsSchema>["query"];
