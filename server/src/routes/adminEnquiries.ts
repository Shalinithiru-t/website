import { Router } from "express"
import { Enquiry, serializeEnquiry } from "../models/Enquiry.js"
import { enquiryUpdateSchema } from "../validation/enquiry.js"

export const adminEnquiriesRouter = Router()

adminEnquiriesRouter.get("/", async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined
  const q = typeof req.query.q === "string" ? req.query.q.trim() : ""

  const filter: Record<string, unknown> = {}
  if (status && ["new", "contacted", "quoted", "closed", "spam"].includes(status)) {
    filter.status = status
  }
  if (q) {
    filter.$or = [
      { referenceId: { $regex: q, $options: "i" } },
      { name: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { product: { $regex: q, $options: "i" } },
      { projectLocation: { $regex: q, $options: "i" } },
    ]
  }

  const docs = await Enquiry.find(filter).sort({ createdAt: -1 })
  res.json({
    success: true,
    enquiries: docs.map(serializeEnquiry),
  })
})

adminEnquiriesRouter.get("/stats", async (_req, res) => {
  const [total, enquiriesNew] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
  ])
  res.json({ success: true, stats: { total, enquiriesNew } })
})

adminEnquiriesRouter.get("/:id", async (req, res) => {
  const doc = await Enquiry.findById(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "Enquiry not found" })
    return
  }
  res.json({ success: true, enquiry: serializeEnquiry(doc) })
})

adminEnquiriesRouter.patch("/:id", async (req, res) => {
  const parsed = enquiryUpdateSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const doc = await Enquiry.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true,
  })
  if (!doc) {
    res.status(404).json({ success: false, message: "Enquiry not found" })
    return
  }

  res.json({ success: true, enquiry: serializeEnquiry(doc) })
})

adminEnquiriesRouter.delete("/:id", async (req, res) => {
  const doc = await Enquiry.findByIdAndDelete(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "Enquiry not found" })
    return
  }
  res.json({ success: true, message: "Enquiry deleted" })
})
