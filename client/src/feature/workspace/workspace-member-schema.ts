import { z } from "zod";

export const addWorkspaceMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .transform((email) => email.toLowerCase()),
  role: z.enum(["admin", "member"]),
});

export type AddWorkspaceMemberValues = z.infer<
  typeof addWorkspaceMemberSchema
>;
