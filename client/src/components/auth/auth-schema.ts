import { z } from "zod"

export const authFormSchema = z
  .object({
    mode: z.enum(["login", "signup"]),
    name: z.string().trim().max(80, "Name cannot exceed 80 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(72, "Password cannot exceed 72 characters"),
    remember: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.mode === "signup" && values.name.length < 2) {
      context.addIssue({
        code: "custom",
        message: "Name must contain at least 2 characters",
        path: ["name"],
      })
    }
  })

export type AuthFormValues = z.infer<typeof authFormSchema>
