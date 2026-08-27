import { Router } from "express"
import { requireAuth, requireAdmin, type AuthRequest } from "../middleware/auth.js"
import { Product } from "../models/Product.js"
import { Blog } from "../models/Blog.js"
import { Enquiry, serializeEnquiry } from "../models/Enquiry.js"
import { Application } from "../models/Application.js"
import { Project } from "../models/Project.js"
import { WhatsAppLead, serializeWhatsAppLead } from "../models/WhatsAppLead.js"
import { adminProductsRouter } from "./adminProducts.js"
import { adminBlogsRouter } from "./adminBlogs.js"
import { adminEnquiriesRouter } from "./adminEnquiries.js"
import { adminApplicationsRouter } from "./adminApplications.js"
import { adminProjectsRouter } from "./adminProjects.js"
import { adminSettingsRouter } from "./adminSettings.js"
import { adminWhatsAppLeadsRouter } from "./adminWhatsAppLeads.js"
import { adminUploadRouter } from "./adminUpload.js"

export const adminRouter = Router()

adminRouter.use(requireAuth, requireAdmin)

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return startOfDay(d)
}

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

adminRouter.get("/dashboard", async (req: AuthRequest, res) => {
  const since7 = daysAgo(6)
  const since14 = daysAgo(13)
  const since30 = daysAgo(29)

  const [
    products,
    productsPublished,
    blogs,
    blogsPublished,
    applications,
    projects,
    enquiriesTotal,
    enquiriesNew,
    enquiriesContacted,
    enquiriesQuoted,
    enquiriesClosed,
    enquiriesSpam,
    enquiriesLast7,
    enquiriesLast30,
    whatsappTotal,
    whatsappLeadsNew,
    whatsappLast7,
    whatsappLast30,
    enquiriesBySource,
    whatsappBySource,
    topProducts,
    recentEnquiries,
    recentWhatsApp,
    enquiryDailyRaw,
    whatsappDailyRaw,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: "published" }),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Application.countDocuments(),
    Project.countDocuments(),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.countDocuments({ status: "contacted" }),
    Enquiry.countDocuments({ status: "quoted" }),
    Enquiry.countDocuments({ status: "closed" }),
    Enquiry.countDocuments({ status: "spam" }),
    Enquiry.countDocuments({ createdAt: { $gte: since7 } }),
    Enquiry.countDocuments({ createdAt: { $gte: since30 } }),
    WhatsAppLead.countDocuments(),
    WhatsAppLead.countDocuments({ status: "new" }),
    WhatsAppLead.countDocuments({ createdAt: { $gte: since7 } }),
    WhatsAppLead.countDocuments({ createdAt: { $gte: since30 } }),
    Enquiry.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    WhatsAppLead.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Enquiry.aggregate([
      { $match: { product: { $nin: ["", "General Enquiry"] } } },
      { $group: { _id: "$product", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Enquiry.find().sort({ createdAt: -1 }).limit(5),
    WhatsAppLead.find().sort({ createdAt: -1 }).limit(5),
    Enquiry.aggregate([
      { $match: { createdAt: { $gte: since14 } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]),
    WhatsAppLead.aggregate([
      { $match: { createdAt: { $gte: since14 } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]),
  ])

  const enquiryMap = new Map(enquiryDailyRaw.map((r: { _id: string; count: number }) => [r._id, r.count]))
  const whatsappMap = new Map(whatsappDailyRaw.map((r: { _id: string; count: number }) => [r._id, r.count]))
  const dailyTrend: { date: string; enquiries: number; whatsapp: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = daysAgo(i)
    const key = dateKey(d)
    dailyTrend.push({
      date: key,
      enquiries: enquiryMap.get(key) || 0,
      whatsapp: whatsappMap.get(key) || 0,
    })
  }

  res.json({
    success: true,
    message: "Dashboard analytics",
    user: req.user,
    stats: {
      products,
      productsPublished,
      blogs,
      blogsPublished,
      applications,
      projects,
      enquiriesNew,
      whatsappLeadsNew,
      phase: "4",
      analytics: {
        enquiriesTotal,
        enquiriesLast7,
        enquiriesLast30,
        enquiriesByStatus: {
          new: enquiriesNew,
          contacted: enquiriesContacted,
          quoted: enquiriesQuoted,
          closed: enquiriesClosed,
          spam: enquiriesSpam,
        },
        enquiriesBySource: enquiriesBySource.map((r: { _id: string; count: number }) => ({
          source: r._id || "other",
          count: r.count,
        })),
        whatsappTotal,
        whatsappLast7,
        whatsappLast30,
        whatsappBySource: whatsappBySource.map((r: { _id: string; count: number }) => ({
          source: r._id || "other",
          count: r.count,
        })),
        topProducts: topProducts.map((r: { _id: string; count: number }) => ({
          product: r._id,
          count: r.count,
        })),
        dailyTrend,
        recentEnquiries: recentEnquiries.map(serializeEnquiry),
        recentWhatsApp: recentWhatsApp.map(serializeWhatsAppLead),
      },
    },
  })
})

adminRouter.use("/products", adminProductsRouter)
adminRouter.use("/blogs", adminBlogsRouter)
adminRouter.use("/applications", adminApplicationsRouter)
adminRouter.use("/projects", adminProjectsRouter)
adminRouter.use("/enquiries", adminEnquiriesRouter)
adminRouter.use("/whatsapp-leads", adminWhatsAppLeadsRouter)
adminRouter.use("/settings", adminSettingsRouter)
adminRouter.use("/upload", adminUploadRouter)
