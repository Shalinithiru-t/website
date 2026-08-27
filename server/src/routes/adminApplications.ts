import { Router } from "express"
import { Application, serializeApplication } from "../models/Application.js"
import { applicationInputSchema } from "../validation/application.js"

export const adminApplicationsRouter = Router()

adminApplicationsRouter.get("/", async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined
  const q = typeof req.query.q === "string" ? req.query.q.trim() : ""

  const filter: Record<string, unknown> = {}
  if (status === "draft" || status === "published") filter.status = status
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
    ]
  }

  const docs = await Application.find(filter).sort({ sortOrder: 1, updatedAt: -1 })
  res.json({
    success: true,
    applications: docs.map(serializeApplication),
  })
})

adminApplicationsRouter.get("/:id", async (req, res) => {
  const doc = await Application.findById(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "Application not found" })
    return
  }
  res.json({ success: true, application: serializeApplication(doc) })
})

adminApplicationsRouter.post("/", async (req, res) => {
  const parsed = applicationInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const exists = await Application.findOne({ slug: parsed.data.slug })
  if (exists) {
    res.status(409).json({ success: false, message: "An application with this slug already exists" })
    return
  }

  const doc = await Application.create(parsed.data)
  res.status(201).json({ success: true, application: serializeApplication(doc) })
})

adminApplicationsRouter.put("/:id", async (req, res) => {
  const parsed = applicationInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const conflict = await Application.findOne({
    slug: parsed.data.slug,
    _id: { $ne: req.params.id },
  })
  if (conflict) {
    res.status(409).json({ success: false, message: "An application with this slug already exists" })
    return
  }

  const doc = await Application.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true,
  })
  if (!doc) {
    res.status(404).json({ success: false, message: "Application not found" })
    return
  }

  res.json({ success: true, application: serializeApplication(doc) })
})

adminApplicationsRouter.delete("/:id", async (req, res) => {
  const doc = await Application.findByIdAndDelete(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "Application not found" })
    return
  }
  res.json({ success: true, message: "Application deleted" })
})
