import { Router } from "express"
import {
  WhatsAppLead,
  generateWhatsAppLeadRef,
  serializeWhatsAppLead,
} from "../models/WhatsAppLead.js"
import { whatsappLeadInputSchema } from "../validation/whatsappLead.js"

export const whatsappLeadsRouter = Router()

whatsappLeadsRouter.post("/", async (req, res) => {
  const parsed = whatsappLeadInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || "Validation failed",
    })
    return
  }

  const doc = await WhatsAppLead.create({
    referenceId: generateWhatsAppLeadRef(),
    ...parsed.data,
    status: "new",
  })

  res.status(201).json({
    success: true,
    lead: serializeWhatsAppLead(doc),
  })
})
