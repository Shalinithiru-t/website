import { z } from "zod"

const digitsSchema = z
  .string()
  .trim()
  .regex(/^\d{10,15}$/, "Enter digits with country code (10–15 digits, numbers only)")

export const siteSettingsInputSchema = z.object({
  phone: z.string().trim().min(5, "Call phone is required"),
  phoneDigits: digitsSchema,
  whatsappPhone: z.string().trim().min(5, "WhatsApp phone is required"),
  whatsappDigits: digitsSchema,
  email: z.string().trim().email("Enter a valid email"),
  salesEmail: z.string().trim().email("Enter a valid sales email"),
  address: z.string().trim().min(5, "Address is required"),
  addressShort: z.string().trim().optional().default(""),
  mapEmbedUrl: z.string().trim().optional().default(""),
})

export type SiteSettingsInput = z.infer<typeof siteSettingsInputSchema>
