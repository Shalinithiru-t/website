import { z } from "zod"

export const enquiryInputSchema = z.object({
  product: z.string().default("General Enquiry"),
  colour: z.string().optional().default(""),
  thickness: z.string().optional().default(""),
  length: z.string().optional().default(""),
  area: z.string().optional().default(""),
  quantity: z.string().optional().default(""),
  surfaceMaterial: z.string().optional().default(""),
  application: z.string().optional().default(""),
  projectLocation: z.string().min(1, "Project location is required"),
  projectType: z.string().min(1, "Project type is required"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().optional().default(""),
  deliveryTimeline: z.string().optional().default(""),
  message: z.string().optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  source: z
    .enum(["home", "enquire", "contact", "product", "configurator", "other"])
    .optional()
    .default("other"),
  productSlug: z.string().optional().default(""),
  productUrl: z.string().optional().default(""),
})

export type EnquiryInput = z.infer<typeof enquiryInputSchema>

export const enquiryUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "quoted", "closed", "spam"]).optional(),
  notes: z.string().optional(),
})

export type EnquiryUpdate = z.infer<typeof enquiryUpdateSchema>
