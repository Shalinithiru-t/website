import { connectDb, disconnectDb } from "../config/db.js"
import { env } from "../config/env.js"
import { User, hashPassword } from "../models/User.js"
import { Product } from "../models/Product.js"
import { Blog } from "../models/Blog.js"
import { products as seedProducts } from "../data/products.seed.js"
import { blogs as seedBlogs } from "../data/blogs.seed.js"
import { applications as seedApplications } from "../data/applications.seed.js"
import { projects as seedProjects } from "../data/projects.seed.js"
import { Application } from "../models/Application.js"
import { Project } from "../models/Project.js"
import { DEFAULT_SITE_SETTINGS } from "../services/siteSettings.js"
import { SiteSettings } from "../models/SiteSettings.js"

const monthMap: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
}

function parseDisplayDate(label: string): Date {
  const [monthName, yearStr] = label.split(" ")
  const month = monthMap[monthName]
  const year = Number(yearStr)
  if (month == null || !year) return new Date()
  return new Date(year, month, 15)
}

async function seed() {
  await connectDb()

  const email = env.ADMIN_EMAIL.toLowerCase()
  const existing = await User.findOne({ email })

  if (existing) {
    console.log(`Admin already exists: ${email}`)
  } else {
    await User.create({
      email,
      name: env.ADMIN_NAME,
      role: "admin",
      passwordHash: await hashPassword(env.ADMIN_PASSWORD),
    })
    console.log(`Admin created: ${email}`)
  }

  for (let i = 0; i < seedProducts.length; i++) {
    const p = seedProducts[i]
    await Product.findOneAndUpdate(
      { slug: p.slug },
      {
        ...p,
        status: "published",
        sortOrder: i,
        metaTitle: p.name,
        metaDescription: p.shortDescription,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  }
  console.log(`Products seeded: ${seedProducts.length}`)

  for (let i = 0; i < seedBlogs.length; i++) {
    const b = seedBlogs[i]
    await Blog.findOneAndUpdate(
      { slug: b.slug },
      {
        ...b,
        status: "published",
        sortOrder: i,
        author: "MountRoof",
        publishedAt: parseDisplayDate(b.date),
        metaTitle: b.title,
        metaDescription: b.excerpt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  }
  console.log(`Blogs seeded: ${seedBlogs.length}`)

  for (let i = 0; i < seedApplications.length; i++) {
    const a = seedApplications[i]
    await Application.findOneAndUpdate(
      { slug: a.slug },
      {
        ...a,
        status: "published",
        sortOrder: i,
        metaTitle: a.name,
        metaDescription: a.shortDescription,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  }
  console.log(`Applications seeded: ${seedApplications.length}`)

  for (let i = 0; i < seedProjects.length; i++) {
    const p = seedProjects[i]
    await Project.findOneAndUpdate(
      { slug: p.slug },
      {
        ...p,
        status: "published",
        sortOrder: i,
        metaTitle: p.title,
        metaDescription: p.summary,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  }
  console.log(`Projects seeded: ${seedProjects.length}`)

  await SiteSettings.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: DEFAULT_SITE_SETTINGS },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
  console.log("Site settings ensured")

  console.log("Seed complete.")
  console.log(`Login with: ${email} / ${env.ADMIN_PASSWORD}`)
  await disconnectDb()
}

seed().catch(async (err) => {
  console.error("Seed failed:", err)
  await disconnectDb().catch(() => undefined)
  process.exit(1)
})
