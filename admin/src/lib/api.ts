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
  enquiriesNew: number
  phase: string
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
    status: "draft",
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
