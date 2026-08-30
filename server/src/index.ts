import express from "express"
import cors from "cors"
import helmet from "helmet"
import path from "node:path"
import { env, getCorsOrigins, isAllowedCorsOrigin, isCloudinaryConfigured } from "./config/env.js"
import { connectDb } from "./config/db.js"
import { ensureUploadsDir, UPLOADS_DIR } from "./services/upload.js"
import { authRouter } from "./routes/auth.js"
import { adminRouter } from "./routes/admin.js"
import { productsRouter } from "./routes/products.js"
import { blogsRouter } from "./routes/blogs.js"
import { applicationsRouter } from "./routes/applications.js"
import { projectsRouter } from "./routes/projects.js"
import { enquiriesRouter } from "./routes/enquiries.js"
import { whatsappLeadsRouter } from "./routes/whatsappLeads.js"
import { settingsRouter } from "./routes/settings.js"
import { notFound, errorHandler } from "./middleware/error.js"

async function main() {
  await connectDb()
  ensureUploadsDir()

  const app = express()

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  )
  app.use(
    cors({
      origin: (origin, callback) => {
        if (isAllowedCorsOrigin(origin)) callback(null, true)
        else callback(null, false)
      },
      credentials: true,
    })
  )
  app.use(express.json({ limit: "2mb" }))
  app.use("/uploads", express.static(UPLOADS_DIR))

  app.get("/api/health", (_req, res) => {
    res.json({
      success: true,
      service: "mountroof-api",
      phase: 5,
      env: env.NODE_ENV,
      uploads: isCloudinaryConfigured() ? "cloudinary" : "local",
    })
  })

  app.use("/api/auth", authRouter)
  app.use("/api/products", productsRouter)
  app.use("/api/blogs", blogsRouter)
  app.use("/api/applications", applicationsRouter)
  app.use("/api/projects", projectsRouter)
  app.use("/api/enquiries", enquiriesRouter)
  app.use("/api/whatsapp-leads", whatsappLeadsRouter)
  app.use("/api/settings", settingsRouter)
  app.use("/api/admin", adminRouter)

  app.use(notFound)
  app.use(errorHandler)

  app.listen(env.PORT, () => {
    console.log(`MountRoof API listening on http://localhost:${env.PORT}`)
    console.log(`CORS origins: ${getCorsOrigins().join(", ")}`)
    console.log(
      `Uploads: ${isCloudinaryConfigured() ? "Cloudinary" : `local → ${path.relative(process.cwd(), UPLOADS_DIR)}`}`
    )
  })
}

main().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
