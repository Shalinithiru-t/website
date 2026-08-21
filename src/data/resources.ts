import type { Resource } from "@/types"

export const resources: Resource[] = [
  {
    slug: "choosing-right-panel-thickness",
    title: "How to Choose the Right PUF Panel Thickness for Your Project",
    excerpt: "A practical guide to matching insulation thickness to your building's thermal, temperature and structural requirements.",
    category: "Technical Guide",
    readTime: "6 min read",
    date: "March 2026",
    image: "https://images.unsplash.com/photo-1587582423116-ec07293f0395?q=80&w=1200&auto=format&fit=crop",
    content: [
      "Selecting PUF panel thickness is one of the most consequential decisions in an insulated building envelope — it directly affects energy costs, structural loading and long-term performance.",
      "For ambient warehousing, 30-50mm panels typically balance cost and thermal performance. For cold storage and blast freeze applications, thickness must be calculated against target internal temperature, ambient conditions and door traffic frequency.",
      "Our technical sales team reviews your project brief — building use, location climate, and internal temperature targets — to recommend a thickness that meets both budget and performance requirements.",
    ],
  },
  {
    slug: "puf-vs-rockwool-core",
    title: "PUF vs Rockwool Core: Which Insulation Core is Right for You?",
    excerpt: "Comparing thermal performance, fire ratings and cost between PUR/PIR foam cores and Rockwool mineral wool cores.",
    category: "Technical Guide",
    readTime: "5 min read",
    date: "February 2026",
    image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=1200&auto=format&fit=crop",
    content: [
      "PUR/PIR foam cores offer superior thermal conductivity per millimetre of thickness, making them the most cost-efficient choice for most industrial roofing and wall applications.",
      "Rockwool mineral wool cores offer higher fire resistance classifications and are often specified where local fire codes or insurance requirements demand it.",
      "MountRoof supplies both core types across our panel range, and our team can advise which is right for your specific building classification and location.",
    ],
  },
  {
    slug: "peb-roofing-installation-timeline",
    title: "What to Expect: A Typical PEB Roofing Installation Timeline",
    excerpt: "From order confirmation to final handover — a realistic look at how long insulated roofing installation takes.",
    category: "Project Planning",
    readTime: "4 min read",
    date: "January 2026",
    image: "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?q=80&w=1200&auto=format&fit=crop",
    content: [
      "Once specifications are finalised, manufacturing lead time typically ranges from 2-4 weeks depending on thickness, colour and order volume.",
      "On-site installation speed depends on roof area and crew size, but insulated panel systems install significantly faster than traditional built-up roofing due to their single-fix design.",
      "We recommend engaging our technical team early in project planning to align manufacturing and delivery schedules with your construction timeline.",
    ],
  },
  {
    slug: "cold-room-panel-hygiene-standards",
    title: "Hygiene Standards for Cold Room and Food Processing Panels",
    excerpt: "Understanding surface finish, joint sealing and material requirements for food-grade insulated panels.",
    category: "Compliance",
    readTime: "5 min read",
    date: "December 2025",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop",
    content: [
      "Food processing and cold storage facilities require panel surfaces that resist bacterial growth, withstand washdown cycles, and maintain a smooth, cleanable finish.",
      "Cam-lock airtight joints minimise gaps where contaminants could accumulate, while plain-profile surfaces avoid ridges that trap residue.",
      "MountRoof offers food-grade coating options and stainless steel surface finishes for facilities operating under strict hygiene compliance requirements.",
    ],
  },
]

export function getResourceBySlug(slug: string) {
  return resources.find((r) => r.slug === slug)
}
