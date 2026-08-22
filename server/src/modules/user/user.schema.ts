import { z } from "zod";

export const registerUserSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(2, "Name must contain at least 2 characters")
            .max(80, "Name cannot exceed 80 characters"),

        email: z
            .string()
            .trim()
            .nonempty("Email is required")
            .max(255, "Email cannot exceed 255 characters")
            .transform((email) => email.toLowerCase()),

        password: z
            .string()
            .min(8, "Password must contain at least 8 characters")
            .max(72, "Password cannot exceed 72 characters"),
    }),
});

export type RegisterUserInput = z.infer<
    typeof registerUserSchema
>["body"];