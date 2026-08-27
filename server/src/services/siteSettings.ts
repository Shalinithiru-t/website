import { env } from "../config/env.js"
import { SiteSettings, serializeSiteSettings, type PublicSiteSettings } from "../models/SiteSettings.js"

export const DEFAULT_SITE_SETTINGS = {
  key: "default" as const,
  phone: "+91 90356 62840",
  phoneDigits: "919035662840",
  whatsappPhone: "+91 90356 62840",
  whatsappDigits: "919035662840",
  email: "Krishnafabtech@gmail.com",
  salesEmail: env.SALES_EMAIL || "Krishnafabtech@gmail.com",
  address: "42, Kapila Nagar, Doddanna Industrial Estate, Peenya, Bengaluru, Karnataka 560058",
  addressShort: "Peenya, Bengaluru, Karnataka",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.468001270824!2d77.51431557512342!3d13.00584208731264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3daab10e333f%3A0x6dfea01cc1a84c44!2s42%2C%20Kapila%20Nagar%2C%20Doddanna%20Industrial%20estste%2C%20Peenya%2C%20Bengaluru%2C%20Karnataka%20560058!5e0!3m2!1sen!2sin!4v1787771722802!5m2!1sen!2sin",
}

export async function getOrCreateSiteSettings() {
  let doc = await SiteSettings.findOne({ key: "default" })
  if (!doc) {
    doc = await SiteSettings.create(DEFAULT_SITE_SETTINGS)
    return doc
  }

  // Backfill WhatsApp fields for docs created before the split
  let dirty = false
  if (!doc.whatsappPhone) {
    doc.whatsappPhone = doc.phone
    dirty = true
  }
  if (!doc.whatsappDigits) {
    doc.whatsappDigits = doc.phoneDigits
    dirty = true
  }
  if (dirty) await doc.save()

  return doc
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const doc = await getOrCreateSiteSettings()
  const { id: _id, updatedAt: _u, ...publicFields } = serializeSiteSettings(doc)
  return publicFields
}

export async function getSalesEmail(): Promise<string> {
  const settings = await getPublicSiteSettings()
  return settings.salesEmail || env.SALES_EMAIL || env.ADMIN_EMAIL
}
