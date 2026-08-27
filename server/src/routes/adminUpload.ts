import { Router } from "express"
import multer from "multer"
import { env } from "../config/env.js"
import { maxUploadBytes, storeImageBuffer } from "../services/upload.js"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxUploadBytes(), files: 1 },
})

export const adminUploadRouter = Router()

adminUploadRouter.post("/image", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      const message =
        err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
          ? "Image must be 5 MB or smaller"
          : err.message || "Upload failed"
      res.status(400).json({ success: false, message })
      return
    }

    const file = req.file
    if (!file) {
      res.status(400).json({ success: false, message: "No file uploaded. Use form field name “file”." })
      return
    }

    try {
      const publicBase = env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`
      const stored = await storeImageBuffer(file.buffer, file.originalname, file.mimetype, publicBase)
      res.status(201).json({
        success: true,
        url: stored.url,
        provider: stored.provider,
        filename: stored.filename,
      })
    } catch (e) {
      res.status(400).json({
        success: false,
        message: e instanceof Error ? e.message : "Upload failed",
      })
    }
  })
})
