import { Router } from "express"
import { WhatsAppLead, serializeWhatsAppLead } from "../models/WhatsAppLead.js"
import { whatsappLeadUpdateSchema } from "../validation/whatsappLead.js"

export const adminWhatsAppLeadsRouter = Router()

adminWhatsAppLeadsRouter.get("/", async (req, res) => {
  const filter: Record<string, unknown> = {}
  if (req.query.status && req.query.status !== "all") {
    filter.status = String(req.query.status)
  }
  if (req.query.source && req.query.source !== "all") {
    filter.source = String(req.query.source)
  }
  if (req.query.q) {
    const q = String(req.query.q).trim()
    if (q) {
      filter.$or = [
        { referenceId: new RegExp(q, "i") },
        { product: new RegExp(q, "i") },
        { message: new RegExp(q, "i") },
        { enquiryReferenceId: new RegExp(q, "i") },
      ]
    }
  }

  const docs = await WhatsAppLead.find(filter).sort({ createdAt: -1 }).limit(200)
  res.json({
    success: true,
    leads: docs.map(serializeWhatsAppLead),
  })
})

adminWhatsAppLeadsRouter.get("/:id", async (req, res) => {
  const doc = await WhatsAppLead.findById(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "WhatsApp lead not found" })
    return
  }
  res.json({ success: true, lead: serializeWhatsAppLead(doc) })
})

adminWhatsAppLeadsRouter.patch("/:id", async (req, res) => {
  const parsed = whatsappLeadUpdateSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid update",
    })
    return
  }

  const doc = await WhatsAppLead.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true,
  })
  if (!doc) {
    res.status(404).json({ success: false, message: "WhatsApp lead not found" })
    return
  }
  res.json({ success: true, lead: serializeWhatsAppLead(doc) })
})
