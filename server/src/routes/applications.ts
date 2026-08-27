import { Router } from "express"
import { Application, serializeApplication } from "../models/Application.js"

export const applicationsRouter = Router()

applicationsRouter.get("/", async (_req, res) => {
  const docs = await Application.find({ status: "published" }).sort({ sortOrder: 1, name: 1 })
  res.json({
    success: true,
    applications: docs.map(serializeApplication),
  })
})

applicationsRouter.get("/:slug", async (req, res) => {
  const doc = await Application.findOne({ slug: req.params.slug, status: "published" })
  if (!doc) {
    res.status(404).json({ success: false, message: "Application not found" })
    return
  }
  res.json({ success: true, application: serializeApplication(doc) })
})
