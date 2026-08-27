import { Router } from "express"
import { getPublicSiteSettings } from "../services/siteSettings.js"

export const settingsRouter = Router()

settingsRouter.get("/", async (_req, res) => {
  const settings = await getPublicSiteSettings()
  res.json({ success: true, settings })
})
