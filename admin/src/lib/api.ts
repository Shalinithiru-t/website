export type ProductStatus = "draft" | "published"

export type AdminProduct = {
  id: string
  slug: string
  name: string
  shortName: string
  category: string
  categoryFilter: string
  shortDescription: string
  heroDescription: string
  images: { url: string; alt: string }[]
  benefits: { title: string; description: string; icon: string }[]
  specifications: Record<string, string>
  thicknessOptions: string[]
  colourOptions: { name: string; hex: string }[]
  surfaceMaterialOptions: string[]
  applicationTags: string[]
  faq: { question: string; answer: string }[]
  relatedProductSlugs: string[]
  datasheetUrl: string
  trustPoints: string[]
  statTiles: { icon: string; value: string; label: string }[]
  metaTitle: string
  metaDescription: string
  status: ProductStatus
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export type ProductInput = Omit<AdminProduct, "id" | "createdAt" | "updatedAt">

const TOKEN_KEY = "mountroof_admin_token"
const USER_KEY = "mountroof_admin_user"

export type AdminUser = {
  id: string
  email: string
  name: string
  role: "admin" | "editor"
}

export type DashboardStats = {
  products: number
  productsPublished?: number
  blogs: number
  blogsPublished?: number
  applications?: number
  projects?: number
  enquiriesNew: number
  whatsappLeadsNew?: number
  phase: string
  analytics?: DashboardAnalytics
}

export type DashboardAnalytics = {
  enquiriesTotal: number
  enquiriesLast7: number
  enquiriesLast30: number
  enquiriesByStatus: {
    new: number
    contacted: number
    quoted: number
    closed: number
    spam: number
  }
  enquiriesBySource: { source: string; count: number }[]
  whatsappTotal: number
  whatsappLast7: number
  whatsappLast30: number
  whatsappBySource: { source: string; count: number }[]
  topProducts: { product: string; count: number }[]
  dailyTrend: { date: string; enquiries: number; whatsapp: number }[]
  recentEnquiries: {
    id: string
    name: string
    product: string
    projectLocation: string
    status: string
    createdAt?: string
  }[]
  recentWhatsApp: {
    id: string
    referenceId: string
    source: string
    product: string
    status: string
    createdAt?: string
  }[]
}

function apiBase(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  return envUrl?.replace(/\/$/, "") || ""
}

function url(path: string): string {
  return `${apiBase()}${path}`
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { message?: string; success?: boolean }
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`)
  }
  return data
}

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): AdminUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function saveSession(token: string, user: AdminUser): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export async function login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch(url("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await parseJson<{ success: boolean; token: string; user: AdminUser }>(res)
  saveSession(data.token, data.user)
  return { token: data.token, user: data.user }
}

export async function fetchMe(token: string): Promise<AdminUser> {
  const res = await fetch(url("/api/auth/me"), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; user: AdminUser }>(res)
  return data.user
}

export async function fetchDashboard(token: string): Promise<DashboardStats> {
  const res = await fetch(url("/api/admin/dashboard"), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; stats: DashboardStats }>(res)
  return data.stats
}

export async function logout(token: string | null): Promise<void> {
  if (token) {
    try {
      await fetch(url("/api/auth/logout"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      // ignore
    }
  }
  clearSession()
}

export async function fetchAdminProducts(
  token: string,
  params?: { status?: string; q?: string }
): Promise<AdminProduct[]> {
  const search = new URLSearchParams()
  if (params?.status) search.set("status", params.status)
  if (params?.q) search.set("q", params.q)
  const qs = search.toString()
  const res = await fetch(url(`/api/admin/products${qs ? `?${qs}` : ""}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; products: AdminProduct[] }>(res)
  return data.products
}

export async function fetchAdminProduct(token: string, id: string): Promise<AdminProduct> {
  const res = await fetch(url(`/api/admin/products/${id}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; product: AdminProduct }>(res)
  return data.product
}

export async function createProduct(token: string, input: ProductInput): Promise<AdminProduct> {
  const res = await fetch(url("/api/admin/products"), {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  })
  const data = await parseJson<{ success: boolean; product: AdminProduct }>(res)
  return data.product
}

export async function updateProduct(token: string, id: string, input: ProductInput): Promise<AdminProduct> {
  const res = await fetch(url(`/api/admin/products/${id}`), {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  })
  const data = await parseJson<{ success: boolean; product: AdminProduct }>(res)
  return data.product
}

export async function deleteProduct(token: string, id: string): Promise<void> {
  const res = await fetch(url(`/api/admin/products/${id}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  await parseJson(res)
}

export function emptyProductInput(): ProductInput {
  return {
    slug: "",
    name: "",
    shortName: "",
    category: "Roofing Systems",
    categoryFilter: "Roofing",
    shortDescription: "",
    heroDescription: "",
    images: [{ url: "", alt: "" }],
    benefits: [{ title: "", description: "", icon: "ShieldCheck" }],
    specifications: { "Panel Width": "" },
    thicknessOptions: ["50mm", "80mm", "100mm"],
    colourOptions: [
      { name: "Off White", hex: "#F1EFE9" },
      { name: "Sky Blue", hex: "#7FB3D5" },
    ],
    surfaceMaterialOptions: ["PPGI", "PPGL"],
    applicationTags: ["Warehouses"],
    faq: [{ question: "", answer: "" }],
    relatedProductSlugs: [],
    datasheetUrl: "#",
    trustPoints: [""],
    statTiles: [],
    metaTitle: "",
    metaDescription: "",
    status: "published",
    sortOrder: 0,
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export type BlogStatus = "draft" | "published"

export type AdminBlog = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  category: string
  readTime: string
  date: string
  image: string
  author: string
  publishedAt?: string
  metaTitle: string
  metaDescription: string
  status: BlogStatus
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export type BlogInput = Omit<AdminBlog, "id" | "createdAt" | "updatedAt" | "publishedAt"> & {
  publishedAt?: string
}

export async function fetchAdminBlogs(
  token: string,
  params?: { status?: string; q?: string }
): Promise<AdminBlog[]> {
  const search = new URLSearchParams()
  if (params?.status) search.set("status", params.status)
  if (params?.q) search.set("q", params.q)
  const qs = search.toString()
  const res = await fetch(url(`/api/admin/blogs${qs ? `?${qs}` : ""}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; blogs: AdminBlog[] }>(res)
  return data.blogs
}

export async function fetchAdminBlog(token: string, id: string): Promise<AdminBlog> {
  const res = await fetch(url(`/api/admin/blogs/${id}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; blog: AdminBlog }>(res)
  return data.blog
}

export async function createBlog(token: string, input: BlogInput): Promise<AdminBlog> {
  const res = await fetch(url("/api/admin/blogs"), {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  })
  const data = await parseJson<{ success: boolean; blog: AdminBlog }>(res)
  return data.blog
}

export async function updateBlog(token: string, id: string, input: BlogInput): Promise<AdminBlog> {
  const res = await fetch(url(`/api/admin/blogs/${id}`), {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  })
  const data = await parseJson<{ success: boolean; blog: AdminBlog }>(res)
  return data.blog
}

export async function deleteBlog(token: string, id: string): Promise<void> {
  const res = await fetch(url(`/api/admin/blogs/${id}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  await parseJson(res)
}

export function emptyBlogInput(): BlogInput {
  return {
    slug: "",
    title: "",
    excerpt: "",
    content: [""],
    category: "Technical Guide",
    readTime: "5 min read",
    date: "",
    image: "",
    author: "MountRoof",
    metaTitle: "",
    metaDescription: "",
    status: "draft",
    sortOrder: 0,
  }
}

export type EnquiryStatus = "new" | "contacted" | "quoted" | "closed" | "spam"

export type AdminEnquiry = {
  id: string
  referenceId: string
  product: string
  colour: string
  thickness: string
  length: string
  area: string
  quantity: string
  surfaceMaterial: string
  application: string
  projectLocation: string
  projectType: string
  name: string
  phone: string
  email: string
  company: string
  deliveryTimeline: string
  message: string
  consent: boolean
  source: string
  productSlug: string
  productUrl: string
  status: EnquiryStatus
  notes: string
  emailSent: boolean
  emailSentAt?: string
  emailError?: string
  createdAt?: string
  updatedAt?: string
}

export async function fetchAdminEnquiries(
  token: string,
  params?: { status?: string; q?: string }
): Promise<AdminEnquiry[]> {
  const search = new URLSearchParams()
  if (params?.status) search.set("status", params.status)
  if (params?.q) search.set("q", params.q)
  const qs = search.toString()
  const res = await fetch(url(`/api/admin/enquiries${qs ? `?${qs}` : ""}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; enquiries: AdminEnquiry[] }>(res)
  return data.enquiries
}

export async function fetchAdminEnquiry(token: string, id: string): Promise<AdminEnquiry> {
  const res = await fetch(url(`/api/admin/enquiries/${id}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; enquiry: AdminEnquiry }>(res)
  return data.enquiry
}

export async function updateAdminEnquiry(
  token: string,
  id: string,
  patch: { status?: EnquiryStatus; notes?: string }
): Promise<AdminEnquiry> {
  const res = await fetch(url(`/api/admin/enquiries/${id}`), {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(patch),
  })
  const data = await parseJson<{ success: boolean; enquiry: AdminEnquiry }>(res)
  return data.enquiry
}

export async function deleteAdminEnquiry(token: string, id: string): Promise<void> {
  const res = await fetch(url(`/api/admin/enquiries/${id}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  await parseJson(res)
}

export type WhatsAppLeadStatus = "new" | "contacted" | "closed"

export type AdminWhatsAppLead = {
  id: string
  referenceId: string
  source: string
  product: string
  productSlug: string
  productUrl: string
  colour: string
  thickness: string
  length: string
  area: string
  quantity: string
  surfaceMaterial: string
  message: string
  enquiryReferenceId: string
  pageUrl: string
  status: WhatsAppLeadStatus
  notes: string
  createdAt?: string
  updatedAt?: string
}

export async function fetchAdminWhatsAppLeads(
  token: string,
  params?: { status?: string; source?: string; q?: string }
): Promise<AdminWhatsAppLead[]> {
  const search = new URLSearchParams()
  if (params?.status) search.set("status", params.status)
  if (params?.source) search.set("source", params.source)
  if (params?.q) search.set("q", params.q)
  const qs = search.toString()
  const res = await fetch(url(`/api/admin/whatsapp-leads${qs ? `?${qs}` : ""}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; leads: AdminWhatsAppLead[] }>(res)
  return data.leads
}

export async function updateAdminWhatsAppLead(
  token: string,
  id: string,
  patch: { status?: WhatsAppLeadStatus; notes?: string }
): Promise<AdminWhatsAppLead> {
  const res = await fetch(url(`/api/admin/whatsapp-leads/${id}`), {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(patch),
  })
  const data = await parseJson<{ success: boolean; lead: AdminWhatsAppLead }>(res)
  return data.lead
}

export type ApplicationStatus = "draft" | "published"

export type AdminApplication = {
  id: string
  slug: string
  name: string
  shortDescription: string
  heroDescription: string
  image: string
  recommendedProductSlugs: string[]
  keyRequirements: string[]
  relatedProjectSlugs: string[]
  metaTitle: string
  metaDescription: string
  status: ApplicationStatus
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export type ApplicationInput = Omit<AdminApplication, "id" | "createdAt" | "updatedAt">

export async function fetchAdminApplications(
  token: string,
  params?: { status?: string; q?: string }
): Promise<AdminApplication[]> {
  const search = new URLSearchParams()
  if (params?.status) search.set("status", params.status)
  if (params?.q) search.set("q", params.q)
  const qs = search.toString()
  const res = await fetch(url(`/api/admin/applications${qs ? `?${qs}` : ""}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; applications: AdminApplication[] }>(res)
  return data.applications
}

export async function fetchAdminApplication(token: string, id: string): Promise<AdminApplication> {
  const res = await fetch(url(`/api/admin/applications/${id}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; application: AdminApplication }>(res)
  return data.application
}

export async function createApplication(token: string, input: ApplicationInput): Promise<AdminApplication> {
  const res = await fetch(url("/api/admin/applications"), {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  })
  const data = await parseJson<{ success: boolean; application: AdminApplication }>(res)
  return data.application
}

export async function updateApplication(
  token: string,
  id: string,
  input: ApplicationInput
): Promise<AdminApplication> {
  const res = await fetch(url(`/api/admin/applications/${id}`), {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  })
  const data = await parseJson<{ success: boolean; application: AdminApplication }>(res)
  return data.application
}

export async function deleteApplication(token: string, id: string): Promise<void> {
  const res = await fetch(url(`/api/admin/applications/${id}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  await parseJson(res)
}

export async function uploadImage(token: string, file: File): Promise<string> {
  const body = new FormData()
  body.append("file", file)
  const res = await fetch(url("/api/admin/upload/image"), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  })
  const data = await parseJson<{ success: boolean; url: string }>(res)
  return data.url
}

export type ProjectStatus = "draft" | "published"

export type AdminProject = {
  id: string
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
  metaTitle: string
  metaDescription: string
  status: ProjectStatus
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export type ProjectInput = Omit<AdminProject, "id" | "createdAt" | "updatedAt">

export async function fetchAdminProjects(
  token: string,
  params?: { status?: string; q?: string }
): Promise<AdminProject[]> {
  const search = new URLSearchParams()
  if (params?.status) search.set("status", params.status)
  if (params?.q) search.set("q", params.q)
  const qs = search.toString()
  const res = await fetch(url(`/api/admin/projects${qs ? `?${qs}` : ""}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; projects: AdminProject[] }>(res)
  return data.projects
}

export async function fetchAdminProject(token: string, id: string): Promise<AdminProject> {
  const res = await fetch(url(`/api/admin/projects/${id}`), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; project: AdminProject }>(res)
  return data.project
}

export async function createProject(token: string, input: ProjectInput): Promise<AdminProject> {
  const res = await fetch(url("/api/admin/projects"), {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  })
  const data = await parseJson<{ success: boolean; project: AdminProject }>(res)
  return data.project
}

export async function updateProject(
  token: string,
  id: string,
  input: ProjectInput
): Promise<AdminProject> {
  const res = await fetch(url(`/api/admin/projects/${id}`), {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  })
  const data = await parseJson<{ success: boolean; project: AdminProject }>(res)
  return data.project
}

export async function deleteProject(token: string, id: string): Promise<void> {
  const res = await fetch(url(`/api/admin/projects/${id}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  await parseJson(res)
}

export function emptyProjectInput(): ProjectInput {
  return {
    slug: "",
    title: "",
    city: "",
    state: "",
    product: "",
    application: "",
    applicationFilter: "Warehouses",
    area: "",
    image: "",
    summary: "",
    challenge: "",
    solution: "",
    productsUsed: [],
    metrics: [],
    gallery: [],
    quote: undefined,
    metaTitle: "",
    metaDescription: "",
    status: "draft",
    sortOrder: 0,
  }
}

export function emptyApplicationInput(): ApplicationInput {
  return {
    slug: "",
    name: "",
    shortDescription: "",
    heroDescription: "",
    image: "",
    recommendedProductSlugs: [],
    keyRequirements: [""],
    relatedProjectSlugs: [],
    metaTitle: "",
    metaDescription: "",
    status: "draft",
    sortOrder: 0,
  }
}

export type SiteSettings = {
  id?: string
  phone: string
  phoneDigits: string
  phoneHref: string
  whatsappPhone: string
  whatsappDigits: string
  whatsappHref: string
  email: string
  salesEmail: string
  address: string
  addressShort: string
  mapEmbedUrl: string
  updatedAt?: string
}

export type SiteSettingsInput = {
  phone: string
  phoneDigits: string
  whatsappPhone: string
  whatsappDigits: string
  email: string
  salesEmail: string
  address: string
  addressShort: string
  mapEmbedUrl: string
}

export async function fetchAdminSettings(token: string): Promise<SiteSettings> {
  const res = await fetch(url("/api/admin/settings"), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson<{ success: boolean; settings: SiteSettings }>(res)
  return data.settings
}

export async function updateAdminSettings(
  token: string,
  input: SiteSettingsInput
): Promise<SiteSettings> {
  const res = await fetch(url("/api/admin/settings"), {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  })
  const data = await parseJson<{ success: boolean; settings: SiteSettings }>(res)
  return data.settings
}

