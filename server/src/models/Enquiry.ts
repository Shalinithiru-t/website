import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const enquirySchema = new Schema(
  {
    referenceId: { type: String, required: true, unique: true, index: true },
    product: { type: String, default: "General Enquiry" },
    colour: { type: String, default: "" },
    thickness: { type: String, default: "" },
    length: { type: String, default: "" },
    area: { type: String, default: "" },
    quantity: { type: String, default: "" },
    surfaceMaterial: { type: String, default: "" },
    application: { type: String, default: "" },
    projectLocation: { type: String, required: true },
    projectType: { type: String, default: "" },
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, default: "" },
    company: { type: String, default: "" },
    deliveryTimeline: { type: String, default: "" },
    message: { type: String, default: "" },
    consent: { type: Boolean, required: true },
    source: {
      type: String,
      enum: ["home", "enquire", "contact", "product", "configurator", "other"],
      default: "other",
    },
    productSlug: { type: String, default: "" },
    productUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "closed", "spam"],
      default: "new",
      index: true,
    },
    notes: { type: String, default: "" },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date, default: null },
    emailError: { type: String, default: "" },
  },
  { timestamps: true }
)

enquirySchema.index({ createdAt: -1 })

export type EnquiryDocument = HydratedDocument<InferSchemaType<typeof enquirySchema>>

export const Enquiry: Model<InferSchemaType<typeof enquirySchema>> =
  mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema)

export function serializeEnquiry(doc: EnquiryDocument) {
  const obj = doc.toObject()
  return {
    id: String(doc._id),
    referenceId: obj.referenceId as string,
    product: obj.product as string,
    colour: obj.colour as string,
    thickness: obj.thickness as string,
    length: obj.length as string,
    area: obj.area as string,
    quantity: obj.quantity as string,
    surfaceMaterial: obj.surfaceMaterial as string,
    application: obj.application as string,
    projectLocation: obj.projectLocation as string,
    projectType: obj.projectType as string,
    name: obj.name as string,
    phone: obj.phone as string,
    email: obj.email as string,
    company: obj.company as string,
    deliveryTimeline: obj.deliveryTimeline as string,
    message: obj.message as string,
    consent: obj.consent as boolean,
    source: obj.source as string,
    productSlug: obj.productSlug as string,
    productUrl: obj.productUrl as string,
    status: obj.status as string,
    notes: obj.notes as string,
    emailSent: obj.emailSent as boolean,
    emailSentAt: obj.emailSentAt,
    emailError: obj.emailError as string,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  }
}

export function generateReferenceId(): string {
  return `MR-${Date.now().toString(36).toUpperCase()}`
}
