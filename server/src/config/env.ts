import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  ADMIN_URL: z.string().default("http://localhost:5174"),
  ADMIN_EMAIL: z.string().email().default("admin@mountroof.com"),
  ADMIN_PASSWORD: z.string().min(8).default("Admin@12345"),
  ADMIN_NAME: z.string().default("MountRoof Admin"),
  SALES_EMAIL: z.string().email().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data

export function getCorsOrigins(): string[] {
  return [env.CLIENT_URL, env.ADMIN_URL].filter(Boolean)
}
