import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters"),
});

export type CreateWorkspaceValues = z.infer<typeof createWorkspaceSchema>;
