import { z } from "zod"

export const blogInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.array(z.string().min(1)).min(1, "At least one content paragraph is required"),
  category: z.string().min(1),
  readTime: z.string().default("5 min read"),
  date: z.string().default(""),
  image: z.string().min(1),
  author: z.string().default("MountRoof"),
  publishedAt: z.coerce.date().optional(),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  sortOrder: z.number().int().default(0),
})

export type BlogInput = z.infer<typeof blogInputSchema>
