import type { Resource } from "@/types"
import { resources as fallbackResources, getResourceBySlug as getFallbackBySlug } from "@/data/resources"
import { apiBase } from "@/lib/apiBase"

function toResource(raw: Record<string, unknown>): Resource {
  return {
    slug: String(raw.slug ?? ""),
    title: String(raw.title ?? ""),
    excerpt: String(raw.excerpt ?? ""),
    category: String(raw.category ?? ""),
    readTime: String(raw.readTime ?? "5 min read"),
    date: String(raw.date ?? ""),
    image: String(raw.image ?? ""),
    content: (raw.content as string[]) ?? [],
  }
}

/** Fetch published blogs/resources from API; falls back to static data if unreachable. */
export async function fetchResources(): Promise<Resource[]> {
  try {
    const res = await fetch(`${apiBase()}/api/blogs`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { success?: boolean; blogs?: Record<string, unknown>[] }
    if (!data.blogs?.length) throw new Error("Empty blogs")
    return data.blogs.map(toResource)
  } catch (err) {
    console.warn("Blogs API unavailable, using static fallback:", err)
    return fallbackResources
  }
}

export async function fetchResourceBySlug(slug: string): Promise<Resource | null> {
  try {
    const res = await fetch(`${apiBase()}/api/blogs/${encodeURIComponent(slug)}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { blog?: Record<string, unknown> }
    if (!data.blog) return null
    return toResource(data.blog)
  } catch (err) {
    console.warn("Blog API unavailable, using static fallback:", err)
    return getFallbackBySlug(slug) ?? null
  }
}
