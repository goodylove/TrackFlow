import "dotenv/config";
import { z } from "zod";

export const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(5000),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    CLIENT_ORIGIN: z
      .url()
      .refine((value) => {
        if (!URL.canParse(value)) return false;
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) && url.origin === value;
      }, "CLIENT_ORIGIN must be an exact HTTP(S) origin without a path")
      .default("http://localhost:5173"),
    COOKIE_SAME_SITE: z.enum(["lax", "none"]).default("lax"),
  })
  .superRefine((config, ctx) => {
    if (
      (config.NODE_ENV === "production" || config.COOKIE_SAME_SITE === "none") &&
      !config.CLIENT_ORIGIN.startsWith("https://")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["CLIENT_ORIGIN"],
        message: "Production and cross-site cookies require an HTTPS frontend origin",
      });
    }
  });

export const env = envSchema.parse(process.env);
