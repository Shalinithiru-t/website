import express from "express"
import cors from "cors"
import helmet from "helmet"
import { env, getCorsOrigins } from "./config/env.js"
import { connectDb } from "./config/db.js"
import { authRouter } from "./routes/auth.js"
import { adminRouter } from "./routes/admin.js"
import { productsRouter } from "./routes/products.js"
import { blogsRouter } from "./routes/blogs.js"
import { notFound, errorHandler } from "./middleware/error.js"

async function main() {
  await connectDb()

  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: getCorsOrigins(),
      credentials: true,
    })
  )
  app.use(express.json({ limit: "2mb" }))

  app.get("/api/health", (_req, res) => {
    res.json({
      success: true,
      service: "mountroof-api",
      phase: 2,
      env: env.NODE_ENV,
    })
  })

  app.use("/api/auth", authRouter)
  app.use("/api/products", productsRouter)
  app.use("/api/blogs", blogsRouter)
  app.use("/api/admin", adminRouter)

  app.use(notFound)
  app.use(errorHandler)

  app.listen(env.PORT, () => {
    console.log(`MountRoof API listening on http://localhost:${env.PORT}`)
    console.log(`CORS origins: ${getCorsOrigins().join(", ")}`)
  })
}

main().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
