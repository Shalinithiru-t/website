import { z } from "zod"

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().default(""),
})

const benefitSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().default("ShieldCheck"),
})

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
})

const colourSchema = z.object({
  name: z.string().min(1),
  hex: z.string().min(1),
})

const statTileSchema = z.object({
  icon: z.string().min(1),
  value: z.string().min(1),
  label: z.string().min(1),
})

export const productInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  name: z.string().min(1),
  shortName: z.string().min(1),
  category: z.string().min(1),
  categoryFilter: z.string().min(1),
  shortDescription: z.string().min(1),
  heroDescription: z.string().min(1),
  images: z.array(imageSchema).default([]),
  benefits: z.array(benefitSchema).default([]),
  specifications: z.record(z.string()).default({}),
  thicknessOptions: z.array(z.string()).default([]),
  colourOptions: z.array(colourSchema).default([]),
  surfaceMaterialOptions: z.array(z.string()).default([]),
  applicationTags: z.array(z.string()).default([]),
  faq: z.array(faqSchema).default([]),
  relatedProductSlugs: z.array(z.string()).default([]),
  datasheetUrl: z.string().default("#"),
  trustPoints: z.array(z.string()).default([]),
  statTiles: z.array(statTileSchema).default([]),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  sortOrder: z.number().int().default(0),
})

export type ProductInput = z.infer<typeof productInputSchema>

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
