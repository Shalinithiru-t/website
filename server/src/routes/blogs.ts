import { Router } from "express"
import { Blog, serializeBlog } from "../models/Blog.js"

export const blogsRouter = Router()

blogsRouter.get("/", async (_req, res) => {
  const docs = await Blog.find({ status: "published" }).sort({ publishedAt: -1, sortOrder: 1 })
  res.json({
    success: true,
    blogs: docs.map(serializeBlog),
  })
})

blogsRouter.get("/:slug", async (req, res) => {
  const doc = await Blog.findOne({ slug: req.params.slug, status: "published" })
  if (!doc) {
    res.status(404).json({ success: false, message: "Blog not found" })
    return
  }
  res.json({ success: true, blog: serializeBlog(doc) })
})
