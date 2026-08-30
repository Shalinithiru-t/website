import type { Product } from "@/types"
import { products as fallbackProducts, getProductBySlug as getFallbackBySlug } from "@/data/products"
import { apiBase } from "@/lib/apiBase"

function toProduct(raw: Record<string, unknown>): Product {
  return {
    slug: String(raw.slug ?? ""),
    name: String(raw.name ?? ""),
    shortName: String(raw.shortName ?? ""),
    category: String(raw.category ?? ""),
    categoryFilter: String(raw.categoryFilter ?? ""),
    shortDescription: String(raw.shortDescription ?? ""),
    heroDescription: String(raw.heroDescription ?? ""),
    images: (raw.images as Product["images"]) ?? [],
    benefits: (raw.benefits as Product["benefits"]) ?? [],
    specifications: (raw.specifications as Product["specifications"]) ?? {},
    thicknessOptions: (raw.thicknessOptions as string[]) ?? [],
    colourOptions: (raw.colourOptions as Product["colourOptions"]) ?? [],
    surfaceMaterialOptions: (raw.surfaceMaterialOptions as string[]) ?? [],
    applicationTags: (raw.applicationTags as string[]) ?? [],
    faq: (raw.faq as Product["faq"]) ?? [],
    relatedProductSlugs: (raw.relatedProductSlugs as string[]) ?? [],
    datasheetUrl: String(raw.datasheetUrl ?? "#"),
    trustPoints: (raw.trustPoints as string[]) ?? [],
    statTiles: (raw.statTiles as Product["statTiles"]) ?? [],
  }
}

/** Fetch published products from API; falls back to static data if API is unreachable. */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${apiBase()}/api/products`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { success?: boolean; products?: Record<string, unknown>[] }
    if (!data.products?.length) throw new Error("Empty products")
    return data.products.map(toProduct)
  } catch (err) {
    console.warn("Products API unavailable, using static fallback:", err)
    return fallbackProducts
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${apiBase()}/api/products/${encodeURIComponent(slug)}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { product?: Record<string, unknown> }
    if (!data.product) return null
    return toProduct(data.product)
  } catch (err) {
    console.warn("Product API unavailable, using static fallback:", err)
    return getFallbackBySlug(slug) ?? null
  }
}
