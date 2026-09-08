import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  CLIENT_ORIGIN: z.url().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
