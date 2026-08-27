import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const whatsappLeadSchema = new Schema(
  {
    referenceId: { type: String, required: true, unique: true, index: true },
    source: {
      type: String,
      enum: ["product", "configurator", "enquiry_success", "contact", "other"],
      default: "other",
      index: true,
    },
    product: { type: String, default: "" },
    productSlug: { type: String, default: "" },
    productUrl: { type: String, default: "" },
    colour: { type: String, default: "" },
    thickness: { type: String, default: "" },
    length: { type: String, default: "" },
    area: { type: String, default: "" },
    quantity: { type: String, default: "" },
    surfaceMaterial: { type: String, default: "" },
    message: { type: String, default: "" },
    enquiryReferenceId: { type: String, default: "" },
    pageUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
)

whatsappLeadSchema.index({ createdAt: -1 })

export type WhatsAppLeadDocument = HydratedDocument<InferSchemaType<typeof whatsappLeadSchema>>

export const WhatsAppLead: Model<InferSchemaType<typeof whatsappLeadSchema>> =
  mongoose.models.WhatsAppLead || mongoose.model("WhatsAppLead", whatsappLeadSchema)

export function serializeWhatsAppLead(doc: WhatsAppLeadDocument) {
  const obj = doc.toObject() as Record<string, unknown>
  return {
    id: String(doc._id),
    referenceId: obj.referenceId as string,
    source: obj.source as string,
    product: (obj.product as string) || "",
    productSlug: (obj.productSlug as string) || "",
    productUrl: (obj.productUrl as string) || "",
    colour: (obj.colour as string) || "",
    thickness: (obj.thickness as string) || "",
    length: (obj.length as string) || "",
    area: (obj.area as string) || "",
    quantity: (obj.quantity as string) || "",
    surfaceMaterial: (obj.surfaceMaterial as string) || "",
    message: (obj.message as string) || "",
    enquiryReferenceId: (obj.enquiryReferenceId as string) || "",
    pageUrl: (obj.pageUrl as string) || "",
    status: obj.status as string,
    notes: (obj.notes as string) || "",
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  }
}

export function generateWhatsAppLeadRef(): string {
  return `WA-${Date.now().toString(36).toUpperCase()}`
}
