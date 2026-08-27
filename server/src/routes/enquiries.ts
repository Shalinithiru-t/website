import { Router } from "express"
import { Enquiry, generateReferenceId, serializeEnquiry } from "../models/Enquiry.js"
import { enquiryInputSchema } from "../validation/enquiry.js"
import { sendEnquiryNotificationEmail } from "../services/email.js"

export const enquiriesRouter = Router()

enquiriesRouter.post("/", async (req, res) => {
  const parsed = enquiryInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const data = parsed.data
  const referenceId = generateReferenceId()

  const doc = await Enquiry.create({
    referenceId,
    ...data,
    email: data.email || "",
    status: "new",
  })

  const emailResult = await sendEnquiryNotificationEmail(doc)
  doc.emailSent = emailResult.sent
  doc.emailSentAt = emailResult.sent ? new Date() : null
  doc.emailError = emailResult.error || ""
  await doc.save()

  const serialized = serializeEnquiry(doc)

  res.status(201).json({
    success: true,
    enquiry: {
      id: serialized.referenceId,
      createdAt: serialized.createdAt,
      product: serialized.product,
      colour: serialized.colour,
      thickness: serialized.thickness,
      length: serialized.length,
      area: serialized.area,
      quantity: serialized.quantity,
      surfaceMaterial: serialized.surfaceMaterial,
      application: serialized.application,
      projectLocation: serialized.projectLocation,
      name: serialized.name,
      phone: serialized.phone,
      email: serialized.email,
      company: serialized.company,
      deliveryTimeline: serialized.deliveryTimeline,
      message: serialized.message,
      consent: serialized.consent,
    },
    emailSent: serialized.emailSent,
  })
})
