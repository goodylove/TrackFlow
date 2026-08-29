import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
});

export const env = envSchema.parse(process.env);
