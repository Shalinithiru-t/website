import { Router } from "express"
import { siteSettingsInputSchema } from "../validation/settings.js"
import { getOrCreateSiteSettings } from "../services/siteSettings.js"
import { serializeSiteSettings } from "../models/SiteSettings.js"

export const adminSettingsRouter = Router()

adminSettingsRouter.get("/", async (_req, res) => {
  const doc = await getOrCreateSiteSettings()
  res.json({ success: true, settings: serializeSiteSettings(doc) })
})

adminSettingsRouter.put("/", async (req, res) => {
  const parsed = siteSettingsInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid settings",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const doc = await getOrCreateSiteSettings()
  doc.phone = parsed.data.phone
  doc.phoneDigits = parsed.data.phoneDigits.replace(/\D/g, "")
  doc.whatsappPhone = parsed.data.whatsappPhone
  doc.whatsappDigits = parsed.data.whatsappDigits.replace(/\D/g, "")
  doc.email = parsed.data.email
  doc.salesEmail = parsed.data.salesEmail
  doc.address = parsed.data.address
  doc.addressShort = parsed.data.addressShort || ""
  doc.mapEmbedUrl = parsed.data.mapEmbedUrl || ""
  await doc.save()

  res.json({ success: true, settings: serializeSiteSettings(doc) })
})
