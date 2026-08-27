import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const metricSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
)

const gallerySchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
)

const quoteSchema = new Schema(
  {
    text: { type: String, default: "" },
    author: { type: String, default: "" },
  },
  { _id: false }
)

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    product: { type: String, required: true, trim: true },
    application: { type: String, required: true, trim: true },
    applicationFilter: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    summary: { type: String, required: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    productsUsed: { type: [String], default: [] },
    metrics: { type: [metricSchema], default: [] },
    gallery: { type: [gallerySchema], default: [] },
    quote: { type: quoteSchema, default: undefined },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

projectSchema.index({ status: 1, sortOrder: 1 })
projectSchema.index({ applicationFilter: 1, status: 1 })

export type ProjectDocument = HydratedDocument<InferSchemaType<typeof projectSchema>>

export const Project: Model<InferSchemaType<typeof projectSchema>> =
  mongoose.models.Project || mongoose.model("Project", projectSchema)

export function serializeProject(doc: ProjectDocument) {
  const obj = doc.toObject() as Record<string, unknown>
  const quote = obj.quote as { text?: string; author?: string } | undefined | null
  return {
    id: String(doc._id),
    slug: obj.slug as string,
    title: obj.title as string,
    city: obj.city as string,
    state: obj.state as string,
    product: obj.product as string,
    application: obj.application as string,
    applicationFilter: obj.applicationFilter as string,
    area: obj.area as string,
    image: obj.image as string,
    summary: obj.summary as string,
    challenge: obj.challenge as string,
    solution: obj.solution as string,
    productsUsed: (obj.productsUsed as string[]) ?? [],
    metrics: (obj.metrics as { label: string; value: string }[]) ?? [],
    gallery: (obj.gallery as { url: string; alt: string }[]) ?? [],
    quote:
      quote && (quote.text || quote.author)
        ? { text: quote.text || "", author: quote.author || "" }
        : undefined,
    metaTitle: (obj.metaTitle as string) || "",
    metaDescription: (obj.metaDescription as string) || "",
    status: obj.status as "draft" | "published",
    sortOrder: (obj.sortOrder as number) ?? 0,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  }
}
