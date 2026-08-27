import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const blogSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
    readTime: { type: String, default: "5 min read" },
    /** Human-readable date label shown on the site (e.g. "March 2026") */
    date: { type: String, default: "" },
    image: { type: String, required: true },
    author: { type: String, default: "MountRoof" },
    publishedAt: { type: Date, default: Date.now },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

blogSchema.index({ status: 1, publishedAt: -1 })
blogSchema.index({ category: 1 })

export type BlogDocument = HydratedDocument<InferSchemaType<typeof blogSchema>>

export const Blog: Model<InferSchemaType<typeof blogSchema>> =
  mongoose.models.Blog || mongoose.model("Blog", blogSchema)

export function serializeBlog(doc: BlogDocument) {
  const obj = doc.toObject() as Record<string, unknown>
  return {
    id: String(doc._id),
    slug: obj.slug as string,
    title: obj.title as string,
    excerpt: obj.excerpt as string,
    content: (obj.content as string[]) ?? [],
    category: obj.category as string,
    readTime: (obj.readTime as string) || "5 min read",
    date: (obj.date as string) || "",
    image: obj.image as string,
    author: (obj.author as string) || "MountRoof",
    publishedAt: obj.publishedAt,
    metaTitle: (obj.metaTitle as string) || "",
    metaDescription: (obj.metaDescription as string) || "",
    status: obj.status as "draft" | "published",
    sortOrder: (obj.sortOrder as number) ?? 0,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  }
}
