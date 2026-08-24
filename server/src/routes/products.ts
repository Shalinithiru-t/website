import { Router } from "express"
import { Product, serializeProduct } from "../models/Product.js"

export const productsRouter = Router()

/** Public: published products only */
productsRouter.get("/", async (_req, res) => {
  const docs = await Product.find({ status: "published" }).sort({ sortOrder: 1, name: 1 })
  res.json({
    success: true,
    products: docs.map(serializeProduct),
  })
})

productsRouter.get("/:slug", async (req, res) => {
  const doc = await Product.findOne({ slug: req.params.slug, status: "published" })
  if (!doc) {
    res.status(404).json({ success: false, message: "Product not found" })
    return
  }
  res.json({ success: true, product: serializeProduct(doc) })
})
