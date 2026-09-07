import { z } from "zod";

export const createCommentFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Write a comment before posting")
    .max(5000, "Comment cannot exceed 5000 characters"),
});

export type CreateCommentFormValues = z.infer<
  typeof createCommentFormSchema
>;
