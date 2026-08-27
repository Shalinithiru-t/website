import { z } from "zod"

const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
})

const gallerySchema = z.object({
  url: z.string().min(1),
  alt: z.string().default(""),
})

const quoteSchema = z
  .object({
    text: z.string().default(""),
    author: z.string().default(""),
  })
  .optional()
  .nullable()

export const projectInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  title: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  product: z.string().min(1),
  application: z.string().min(1),
  applicationFilter: z.string().min(1),
  area: z.string().min(1),
  image: z.string().min(1),
  summary: z.string().min(1),
  challenge: z.string().min(1),
  solution: z.string().min(1),
  productsUsed: z.array(z.string()).default([]),
  metrics: z.array(metricSchema).default([]),
  gallery: z.array(gallerySchema).default([]),
  quote: quoteSchema,
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  sortOrder: z.number().int().default(0),
})

export type ProjectInput = z.infer<typeof projectInputSchema>
