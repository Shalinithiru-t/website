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
  MAIL_FROM: z.string().email().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_SECURE: z
    .preprocess((v) => v === "true" || v === true, z.boolean())
    .default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  PUBLIC_API_URL: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().optional().default("mountroof"),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors)
  throw new Error("Invalid environment variables")
}

export const env: z.infer<typeof envSchema> = parsed.data

export function isEmailConfigured(): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS)
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET)
}

export function getCorsOrigins(): string[] {
  return [env.CLIENT_URL, env.ADMIN_URL].filter(Boolean)
}
