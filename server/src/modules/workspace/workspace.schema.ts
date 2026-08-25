import { z } from "zod";

export const createWorkspaceSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(80, "Name cannot exceed 80 characters"),

    description: z.string().trim().max(300, "Description cannot exceed 300 characters"),
  }),
});

export type createWorkSpaceInput = z.infer<typeof createWorkspaceSchema>["body"];

export const addWorkspaceMemberSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .transform((email) => email.toLowerCase()),

    role: z.enum(["admin", "member"]).default("member"),
  }),
});

export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberSchema>["body"];


export const changeWorkspaceMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "member"]),
  }),
});

export type changeWorkspaceMemberRoleInput = z.infer<
  typeof changeWorkspaceMemberRoleSchema
>["body"];