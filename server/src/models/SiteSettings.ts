import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const siteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    /** Call Us — display */
    phone: { type: String, required: true },
    /** Call Us — digits with country code for tel: */
    phoneDigits: { type: String, required: true },
    /** WhatsApp — display */
    whatsappPhone: { type: String, required: true },
    /** WhatsApp — digits with country code for wa.me */
    whatsappDigits: { type: String, required: true },
    email: { type: String, required: true },
    salesEmail: { type: String, required: true },
    address: { type: String, required: true },
    addressShort: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },
  },
  { timestamps: true }
)

export type SiteSettingsDocument = HydratedDocument<InferSchemaType<typeof siteSettingsSchema>>

export const SiteSettings: Model<InferSchemaType<typeof siteSettingsSchema>> =
  mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema)

export type PublicSiteSettings = {
  phone: string
  phoneDigits: string
  phoneHref: string
  whatsappPhone: string
  whatsappDigits: string
  whatsappHref: string
  email: string
  salesEmail: string
  address: string
  addressShort: string
  mapEmbedUrl: string
}

export function serializeSiteSettings(doc: SiteSettingsDocument): PublicSiteSettings & {
  id: string
  updatedAt?: Date
} {
  const phoneDigits = String(doc.phoneDigits || "").replace(/\D/g, "")
  const whatsappDigits = String(doc.whatsappDigits || doc.phoneDigits || "").replace(/\D/g, "")
  const whatsappPhone = String(doc.whatsappPhone || doc.phone || "")
  return {
    id: String(doc._id),
    phone: doc.phone,
    phoneDigits,
    phoneHref: `tel:+${phoneDigits}`,
    whatsappPhone,
    whatsappDigits,
    whatsappHref: `https://wa.me/${whatsappDigits}`,
    email: doc.email,
    salesEmail: doc.salesEmail,
    address: doc.address,
    addressShort: doc.addressShort || "",
    mapEmbedUrl: doc.mapEmbedUrl || "",
    updatedAt: doc.updatedAt,
  }
}
