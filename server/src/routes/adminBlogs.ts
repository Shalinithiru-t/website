import { Router } from "express"
import { Blog, serializeBlog } from "../models/Blog.js"
import { blogInputSchema } from "../validation/blog.js"

export const adminBlogsRouter = Router()

adminBlogsRouter.get("/", async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined
  const q = typeof req.query.q === "string" ? req.query.q.trim() : ""

  const filter: Record<string, unknown> = {}
  if (status === "draft" || status === "published") filter.status = status
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ]
  }

  const docs = await Blog.find(filter).sort({ publishedAt: -1, updatedAt: -1 })
  res.json({
    success: true,
    blogs: docs.map(serializeBlog),
  })
})

adminBlogsRouter.get("/:id", async (req, res) => {
  const doc = await Blog.findById(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "Blog not found" })
    return
  }
  res.json({ success: true, blog: serializeBlog(doc) })
})

adminBlogsRouter.post("/", async (req, res) => {
  const parsed = blogInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const exists = await Blog.findOne({ slug: parsed.data.slug })
  if (exists) {
    res.status(409).json({ success: false, message: "A blog with this slug already exists" })
    return
  }

  const doc = await Blog.create({
    ...parsed.data,
    publishedAt: parsed.data.publishedAt ?? new Date(),
  })
  res.status(201).json({ success: true, blog: serializeBlog(doc) })
})

adminBlogsRouter.put("/:id", async (req, res) => {
  const parsed = blogInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const conflict = await Blog.findOne({
    slug: parsed.data.slug,
    _id: { $ne: req.params.id },
  })
  if (conflict) {
    res.status(409).json({ success: false, message: "A blog with this slug already exists" })
    return
  }

  const doc = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ?? new Date(),
    },
    { new: true, runValidators: true }
  )
  if (!doc) {
    res.status(404).json({ success: false, message: "Blog not found" })
    return
  }

  res.json({ success: true, blog: serializeBlog(doc) })
})

adminBlogsRouter.delete("/:id", async (req, res) => {
  const doc = await Blog.findByIdAndDelete(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "Blog not found" })
    return
  }
  res.json({ success: true, message: "Blog deleted" })
})
