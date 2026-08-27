import { z } from "zod"

export const whatsappLeadInputSchema = z.object({
  source: z.enum(["product", "configurator", "enquiry_success", "contact", "other"]).default("other"),
  product: z.string().trim().max(200).optional().default(""),
  productSlug: z.string().trim().max(120).optional().default(""),
  productUrl: z.string().trim().max(500).optional().default(""),
  colour: z.string().trim().max(80).optional().default(""),
  thickness: z.string().trim().max(40).optional().default(""),
  length: z.string().trim().max(40).optional().default(""),
  area: z.string().trim().max(40).optional().default(""),
  quantity: z.string().trim().max(40).optional().default(""),
  surfaceMaterial: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  enquiryReferenceId: z.string().trim().max(40).optional().default(""),
  pageUrl: z.string().trim().max(500).optional().default(""),
})

export type WhatsAppLeadInput = z.infer<typeof whatsappLeadInputSchema>

export const whatsappLeadUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]).optional(),
  notes: z.string().max(5000).optional(),
})
