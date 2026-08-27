export interface Enquiry {
  id: string
  createdAt: string
  product: string
  colour: string
  thickness: string
  length: string
  area: string
  quantity: string
  surfaceMaterial: string
  application: string
  projectLocation: string
  name: string
  phone: string
  email: string
  company: string
  deliveryTimeline: string
  message: string
  consent: boolean
  projectType?: string
}

export interface ProductBenefit {
  title: string
  description: string
  icon: string
}

export interface ProductFaq {
  question: string
  answer: string
}

export interface ProductStatTile {
  icon: string
  value: string
  label: string
}

export interface Product {
  slug: string
  name: string
  shortName: string
  category: string
  categoryFilter: string
  shortDescription: string
  heroDescription: string
  images: { url: string; alt: string }[]
  benefits: ProductBenefit[]
  specifications: Record<string, string>
  thicknessOptions: string[]
  colourOptions: { name: string; hex: string }[]
  surfaceMaterialOptions: string[]
  applicationTags: string[]
  faq: ProductFaq[]
  relatedProductSlugs: string[]
  datasheetUrl: string
  trustPoints: string[]
  statTiles?: ProductStatTile[]
}

export interface Project {
  slug: string
  title: string
  city: string
  state: string
  product: string
  application: string
  applicationFilter: string
  area: string
  image: string
  summary: string
  challenge: string
  solution: string
  productsUsed: string[]
  metrics: { label: string; value: string }[]
  gallery: { url: string; alt: string }[]
  quote?: { text: string; author: string }
}

export interface Application {
  slug: string
  name: string
  shortDescription: string
  heroDescription: string
  image: string
  recommendedProductSlugs: string[]
  keyRequirements: string[]
  relatedProjectSlugs: string[]
}

export interface Resource {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  image: string
  content: string[]
}
