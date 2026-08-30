import { siteInfo as fallbackSiteInfo } from "@/data/site"
import { apiBase } from "@/lib/apiBase"

export type LiveSiteInfo = {
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
  legalName: string
  brandName: string
  tagline: string
  year: number
}

export function defaultLiveSiteInfo(): LiveSiteInfo {
  return {
    phone: fallbackSiteInfo.phone,
    phoneDigits: fallbackSiteInfo.phoneDigits,
    phoneHref: fallbackSiteInfo.phoneHref,
    whatsappPhone: fallbackSiteInfo.whatsappPhone,
    whatsappDigits: fallbackSiteInfo.whatsappDigits,
    whatsappHref: fallbackSiteInfo.whatsappHref,
    email: fallbackSiteInfo.email,
    salesEmail: fallbackSiteInfo.salesEmail,
    address: fallbackSiteInfo.address,
    addressShort: fallbackSiteInfo.addressShort,
    mapEmbedUrl: fallbackSiteInfo.mapEmbedUrl,
    legalName: fallbackSiteInfo.legalName,
    brandName: fallbackSiteInfo.brandName,
    tagline: fallbackSiteInfo.tagline,
    year: fallbackSiteInfo.year,
  }
}

export async function fetchSiteSettings(): Promise<LiveSiteInfo> {
  const fallback = defaultLiveSiteInfo()
  try {
    const res = await fetch(`${apiBase()}/api/settings`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as {
      settings?: {
        phone?: string
        phoneDigits?: string
        phoneHref?: string
        whatsappPhone?: string
        whatsappDigits?: string
        whatsappHref?: string
        email?: string
        salesEmail?: string
        address?: string
        addressShort?: string
        mapEmbedUrl?: string
      }
    }
    const s = data.settings
    if (!s?.phone || !s.phoneDigits) throw new Error("Invalid settings")
    const phoneDigits = String(s.phoneDigits).replace(/\D/g, "")
    const whatsappDigits = String(s.whatsappDigits || s.phoneDigits).replace(/\D/g, "")
    return {
      ...fallback,
      phone: s.phone,
      phoneDigits,
      phoneHref: s.phoneHref || `tel:+${phoneDigits}`,
      whatsappPhone: s.whatsappPhone || s.phone,
      whatsappDigits,
      whatsappHref: s.whatsappHref || `https://wa.me/${whatsappDigits}`,
      email: s.email || fallback.email,
      salesEmail: s.salesEmail || fallback.salesEmail,
      address: s.address || fallback.address,
      addressShort: s.addressShort || fallback.addressShort,
      mapEmbedUrl: s.mapEmbedUrl || fallback.mapEmbedUrl,
    }
  } catch (err) {
    console.warn("Site settings API unavailable, using static fallback:", err)
    return fallback
  }
}
