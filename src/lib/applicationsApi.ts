import type { Application } from "@/types"
import { applications as fallbackApplications, getApplicationBySlug as getFallbackBySlug } from "@/data/applications"

function apiBase(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  return envUrl?.replace(/\/$/, "") || ""
}

function toApplication(raw: Record<string, unknown>): Application {
  return {
    slug: String(raw.slug ?? ""),
    name: String(raw.name ?? ""),
    shortDescription: String(raw.shortDescription ?? ""),
    heroDescription: String(raw.heroDescription ?? ""),
    image: String(raw.image ?? ""),
    recommendedProductSlugs: (raw.recommendedProductSlugs as string[]) ?? [],
    keyRequirements: (raw.keyRequirements as string[]) ?? [],
    relatedProjectSlugs: (raw.relatedProjectSlugs as string[]) ?? [],
  }
}

export async function fetchApplications(): Promise<Application[]> {
  try {
    const res = await fetch(`${apiBase()}/api/applications`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { applications?: Record<string, unknown>[] }
    if (!data.applications?.length) throw new Error("Empty applications")
    return data.applications.map(toApplication)
  } catch (err) {
    console.warn("Applications API unavailable, using static fallback:", err)
    return fallbackApplications
  }
}

export async function fetchApplicationBySlug(slug: string): Promise<Application | null> {
  try {
    const res = await fetch(`${apiBase()}/api/applications/${encodeURIComponent(slug)}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { application?: Record<string, unknown> }
    if (!data.application) return null
    return toApplication(data.application)
  } catch (err) {
    console.warn("Application API unavailable, using static fallback:", err)
    return getFallbackBySlug(slug) ?? null
  }
}
