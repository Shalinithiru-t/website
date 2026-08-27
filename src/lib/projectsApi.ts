import type { Project } from "@/types"
import { projects as fallbackProjects, getProjectBySlug as getFallbackBySlug } from "@/data/projects"

function apiBase(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  return envUrl?.replace(/\/$/, "") || ""
}

function toProject(raw: Record<string, unknown>): Project {
  const quote = raw.quote as { text?: string; author?: string } | undefined | null
  return {
    slug: String(raw.slug ?? ""),
    title: String(raw.title ?? ""),
    city: String(raw.city ?? ""),
    state: String(raw.state ?? ""),
    product: String(raw.product ?? ""),
    application: String(raw.application ?? ""),
    applicationFilter: String(raw.applicationFilter ?? ""),
    area: String(raw.area ?? ""),
    image: String(raw.image ?? ""),
    summary: String(raw.summary ?? ""),
    challenge: String(raw.challenge ?? ""),
    solution: String(raw.solution ?? ""),
    productsUsed: (raw.productsUsed as string[]) ?? [],
    metrics: (raw.metrics as { label: string; value: string }[]) ?? [],
    gallery: (raw.gallery as { url: string; alt: string }[]) ?? [],
    quote:
      quote && (quote.text || quote.author)
        ? { text: quote.text || "", author: quote.author || "" }
        : undefined,
  }
}

export async function fetchProjects(applicationFilter?: string): Promise<Project[]> {
  try {
    const search = new URLSearchParams()
    if (applicationFilter && applicationFilter !== "All") {
      search.set("applicationFilter", applicationFilter)
    }
    const qs = search.toString()
    const res = await fetch(`${apiBase()}/api/projects${qs ? `?${qs}` : ""}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { projects?: Record<string, unknown>[] }
    if (!data.projects?.length) throw new Error("Empty projects")
    return data.projects.map(toProject)
  } catch (err) {
    console.warn("Projects API unavailable, using static fallback:", err)
    if (applicationFilter && applicationFilter !== "All") {
      return fallbackProjects.filter((p) => p.applicationFilter === applicationFilter)
    }
    return fallbackProjects
  }
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${apiBase()}/api/projects/${encodeURIComponent(slug)}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { project?: Record<string, unknown> }
    if (!data.project) return null
    return toProject(data.project)
  } catch (err) {
    console.warn("Project API unavailable, using static fallback:", err)
    return getFallbackBySlug(slug) ?? null
  }
}
