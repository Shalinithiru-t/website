import { Router } from "express"
import { Project, serializeProject } from "../models/Project.js"
import { projectInputSchema } from "../validation/project.js"

export const adminProjectsRouter = Router()

adminProjectsRouter.get("/", async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined
  const q = typeof req.query.q === "string" ? req.query.q.trim() : ""

  const filter: Record<string, unknown> = {}
  if (status === "draft" || status === "published") filter.status = status
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
      { city: { $regex: q, $options: "i" } },
      { application: { $regex: q, $options: "i" } },
    ]
  }

  const docs = await Project.find(filter).sort({ sortOrder: 1, updatedAt: -1 })
  res.json({
    success: true,
    projects: docs.map(serializeProject),
  })
})

adminProjectsRouter.get("/:id", async (req, res) => {
  const doc = await Project.findById(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "Project not found" })
    return
  }
  res.json({ success: true, project: serializeProject(doc) })
})

adminProjectsRouter.post("/", async (req, res) => {
  const parsed = projectInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const data = {
    ...parsed.data,
    quote:
      parsed.data.quote && (parsed.data.quote.text || parsed.data.quote.author)
        ? parsed.data.quote
        : undefined,
  }

  const exists = await Project.findOne({ slug: data.slug })
  if (exists) {
    res.status(409).json({ success: false, message: "A project with this slug already exists" })
    return
  }

  const doc = await Project.create(data)
  res.status(201).json({ success: true, project: serializeProject(doc) })
})

adminProjectsRouter.put("/:id", async (req, res) => {
  const parsed = projectInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const data = {
    ...parsed.data,
    quote:
      parsed.data.quote && (parsed.data.quote.text || parsed.data.quote.author)
        ? parsed.data.quote
        : undefined,
  }

  const conflict = await Project.findOne({
    slug: data.slug,
    _id: { $ne: req.params.id },
  })
  if (conflict) {
    res.status(409).json({ success: false, message: "A project with this slug already exists" })
    return
  }

  const doc = await Project.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  })
  if (!doc) {
    res.status(404).json({ success: false, message: "Project not found" })
    return
  }

  res.json({ success: true, project: serializeProject(doc) })
})

adminProjectsRouter.delete("/:id", async (req, res) => {
  const doc = await Project.findByIdAndDelete(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "Project not found" })
    return
  }
  res.json({ success: true, message: "Project deleted" })
})
