import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
)

const benefitSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "ShieldCheck" },
  },
  { _id: false }
)

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
)

const colourSchema = new Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
  },
  { _id: false }
)

const statTileSchema = new Schema(
  {
    icon: { type: String, required: true },
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
)

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    categoryFilter: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    heroDescription: { type: String, required: true },
    images: { type: [imageSchema], default: [] },
    benefits: { type: [benefitSchema], default: [] },
    specifications: { type: Map, of: String, default: {} },
    thicknessOptions: { type: [String], default: [] },
    colourOptions: { type: [colourSchema], default: [] },
    surfaceMaterialOptions: { type: [String], default: [] },
    applicationTags: { type: [String], default: [] },
    faq: { type: [faqSchema], default: [] },
    relatedProductSlugs: { type: [String], default: [] },
    datasheetUrl: { type: String, default: "#" },
    trustPoints: { type: [String], default: [] },
    statTiles: { type: [statTileSchema], default: [] },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

productSchema.index({ status: 1, sortOrder: 1 })
productSchema.index({ categoryFilter: 1 })

export type ProductDocument = HydratedDocument<InferSchemaType<typeof productSchema>>

export const Product: Model<InferSchemaType<typeof productSchema>> =
  mongoose.models.Product || mongoose.model("Product", productSchema)

/** Convert Map / document to plain API object matching frontend Product type */
export function serializeProduct(doc: ProductDocument) {
  const obj = doc.toObject({ flattenMaps: true }) as Record<string, unknown>
  const specs = obj.specifications
  const specifications =
    specs instanceof Map
      ? Object.fromEntries(specs.entries())
      : ((specs as Record<string, string>) ?? {})

  return {
    id: String(doc._id),
    slug: obj.slug as string,
    name: obj.name as string,
    shortName: obj.shortName as string,
    category: obj.category as string,
    categoryFilter: obj.categoryFilter as string,
    shortDescription: obj.shortDescription as string,
    heroDescription: obj.heroDescription as string,
    images: obj.images ?? [],
    benefits: obj.benefits ?? [],
    specifications,
    thicknessOptions: obj.thicknessOptions ?? [],
    colourOptions: obj.colourOptions ?? [],
    surfaceMaterialOptions: obj.surfaceMaterialOptions ?? [],
    applicationTags: obj.applicationTags ?? [],
    faq: obj.faq ?? [],
    relatedProductSlugs: obj.relatedProductSlugs ?? [],
    datasheetUrl: (obj.datasheetUrl as string) || "#",
    trustPoints: obj.trustPoints ?? [],
    statTiles: obj.statTiles ?? [],
    metaTitle: (obj.metaTitle as string) || "",
    metaDescription: (obj.metaDescription as string) || "",
    status: obj.status as "draft" | "published",
    sortOrder: (obj.sortOrder as number) ?? 0,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  }
}
