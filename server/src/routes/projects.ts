import { Router } from "express"
import { Project, serializeProject } from "../models/Project.js"

export const projectsRouter = Router()

projectsRouter.get("/", async (req, res) => {
  const filter: Record<string, unknown> = { status: "published" }
  const applicationFilter =
    typeof req.query.applicationFilter === "string" ? req.query.applicationFilter.trim() : ""
  if (applicationFilter && applicationFilter !== "All") {
    filter.applicationFilter = applicationFilter
  }

  const docs = await Project.find(filter).sort({ sortOrder: 1, updatedAt: -1 })
  res.json({
    success: true,
    projects: docs.map(serializeProject),
  })
})

projectsRouter.get("/:slug", async (req, res) => {
  const doc = await Project.findOne({ slug: req.params.slug, status: "published" })
  if (!doc) {
    res.status(404).json({ success: false, message: "Project not found" })
    return
  }
  res.json({ success: true, project: serializeProject(doc) })
})
