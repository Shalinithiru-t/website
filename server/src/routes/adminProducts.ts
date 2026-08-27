import { Router } from "express"
import { Product, serializeProduct } from "../models/Product.js"
import { productInputSchema } from "../validation/product.js"

export const adminProductsRouter = Router()

adminProductsRouter.get("/", async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined
  const q = typeof req.query.q === "string" ? req.query.q.trim() : ""

  const filter: Record<string, unknown> = {}
  if (status === "draft" || status === "published") filter.status = status
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
      { shortName: { $regex: q, $options: "i" } },
    ]
  }

  const docs = await Product.find(filter).sort({ sortOrder: 1, updatedAt: -1 })
  res.json({
    success: true,
    products: docs.map(serializeProduct),
  })
})

adminProductsRouter.get("/:id", async (req, res) => {
  const doc = await Product.findById(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "Product not found" })
    return
  }
  res.json({ success: true, product: serializeProduct(doc) })
})

adminProductsRouter.post("/", async (req, res) => {
  const parsed = productInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const exists = await Product.findOne({ slug: parsed.data.slug })
  if (exists) {
    res.status(409).json({ success: false, message: "A product with this slug already exists" })
    return
  }

  const doc = await Product.create(parsed.data)
  res.status(201).json({ success: true, product: serializeProduct(doc) })
})

adminProductsRouter.put("/:id", async (req, res) => {
  const parsed = productInputSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const conflict = await Product.findOne({
    slug: parsed.data.slug,
    _id: { $ne: req.params.id },
  })
  if (conflict) {
    res.status(409).json({ success: false, message: "A product with this slug already exists" })
    return
  }

  const doc = await Product.findByIdAndUpdate(req.params.id, parsed.data, {
    new: true,
    runValidators: true,
  })
  if (!doc) {
    res.status(404).json({ success: false, message: "Product not found" })
    return
  }

  res.json({ success: true, product: serializeProduct(doc) })
})

adminProductsRouter.delete("/:id", async (req, res) => {
  const doc = await Product.findByIdAndDelete(req.params.id)
  if (!doc) {
    res.status(404).json({ success: false, message: "Product not found" })
    return
  }
  res.json({ success: true, message: "Product deleted" })
})
