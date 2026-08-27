import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const applicationSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    heroDescription: { type: String, required: true },
    image: { type: String, required: true },
    recommendedProductSlugs: { type: [String], default: [] },
    keyRequirements: { type: [String], default: [] },
    relatedProjectSlugs: { type: [String], default: [] },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

applicationSchema.index({ status: 1, sortOrder: 1 })

export type ApplicationDocument = HydratedDocument<InferSchemaType<typeof applicationSchema>>

export const Application: Model<InferSchemaType<typeof applicationSchema>> =
  mongoose.models.Application || mongoose.model("Application", applicationSchema)

export function serializeApplication(doc: ApplicationDocument) {
  const obj = doc.toObject() as Record<string, unknown>
  return {
    id: String(doc._id),
    slug: obj.slug as string,
    name: obj.name as string,
    shortDescription: obj.shortDescription as string,
    heroDescription: obj.heroDescription as string,
    image: obj.image as string,
    recommendedProductSlugs: (obj.recommendedProductSlugs as string[]) ?? [],
    keyRequirements: (obj.keyRequirements as string[]) ?? [],
    relatedProjectSlugs: (obj.relatedProjectSlugs as string[]) ?? [],
    metaTitle: (obj.metaTitle as string) || "",
    metaDescription: (obj.metaDescription as string) || "",
    status: obj.status as "draft" | "published",
    sortOrder: (obj.sortOrder as number) ?? 0,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  }
}
