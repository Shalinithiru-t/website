import { z } from "zod"

export const applicationInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  heroDescription: z.string().min(1),
  image: z.string().min(1),
  recommendedProductSlugs: z.array(z.string()).default([]),
  keyRequirements: z.array(z.string()).default([]),
  relatedProjectSlugs: z.array(z.string()).default([]),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  sortOrder: z.number().int().default(0),
})

export type ApplicationInput = z.infer<typeof applicationInputSchema>
