import { Router } from "express"
import { requireAuth, requireAdmin, type AuthRequest } from "../middleware/auth.js"
import { Product } from "../models/Product.js"
import { Blog } from "../models/Blog.js"
import { adminProductsRouter } from "./adminProducts.js"
import { adminBlogsRouter } from "./adminBlogs.js"

export const adminRouter = Router()

adminRouter.use(requireAuth, requireAdmin)

adminRouter.get("/dashboard", async (req: AuthRequest, res) => {
  const [products, productsPublished, blogs, blogsPublished] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: "published" }),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
  ])

  res.json({
    success: true,
    message: "Phase 2 dashboard — Products & Blogs live; Enquiries next",
    user: req.user,
    stats: {
      products,
      productsPublished,
      blogs,
      blogsPublished,
      enquiriesNew: 0,
      phase: "2",
    },
  })
})

adminRouter.use("/products", adminProductsRouter)
adminRouter.use("/blogs", adminBlogsRouter)
