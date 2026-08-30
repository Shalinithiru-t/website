import { siteInfo as staticSiteInfo } from "@/data/site"
import { apiBase } from "@/lib/apiBase"

let runtimeWhatsAppDigits = staticSiteInfo.whatsappDigits

/** Keep WhatsApp links in sync with live site settings (updated by SiteInfoProvider). */
export function setWhatsAppPhoneDigits(digits: string) {
  const cleaned = digits.replace(/\D/g, "")
  if (cleaned) runtimeWhatsAppDigits = cleaned
}

/** Build a WhatsApp click-to-chat URL to MountRoof's WhatsApp number with optional prefilled text. */
export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${runtimeWhatsAppDigits}`
  if (!message?.trim()) return base
  return `${base}?text=${encodeURIComponent(message.trim())}`
}

export type WhatsAppLeadPayload = {
  source: "product" | "configurator" | "enquiry_success" | "contact" | "other"
  product?: string
  productSlug?: string
  productUrl?: string
  colour?: string
  thickness?: string
  length?: string
  area?: string
  quantity?: string
  surfaceMaterial?: string
  message?: string
  enquiryReferenceId?: string
  pageUrl?: string
}

/** Log the click in admin (best-effort), then return the WhatsApp URL to open. */
export async function logAndBuildWhatsAppUrl(
  payload: WhatsAppLeadPayload,
  message?: string
): Promise<string> {
  const href = buildWhatsAppUrl(message)
  try {
    await fetch(`${apiBase()}/api/whatsapp-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        message: payload.message || message || "",
        pageUrl:
          payload.pageUrl ||
          (typeof window !== "undefined" ? window.location.href : ""),
      }),
      keepalive: true,
    })
  } catch (err) {
    console.warn("WhatsApp lead log failed:", err)
  }
  return href
}

export function productWhatsAppMessage(productName: string, productUrl: string): string {
  return [
    "Hi MountRoof team,",
    "",
    "I would like a quote for the following product:",
    "",
    `📦 Product: ${productName}`,
    `🔗 Link: ${productUrl}`,
    "",
    "Please share pricing, lead time, and technical guidance for my project.",
    "Thank you.",
  ].join("\n")
}

export function configurationWhatsAppMessage(opts: {
  productName: string
  productUrl: string
  colour?: string
  thickness?: string
  length?: string
  quantity?: string
  area?: string
  surfaceMaterial?: string
}): string {
  const details = [
    opts.colour ? `🎨 Colour: ${opts.colour}` : "",
    opts.thickness ? `📏 Thickness: ${opts.thickness}` : "",
    opts.length ? `📐 Length: ${opts.length} m` : "",
    opts.quantity ? `🔢 Quantity: ${opts.quantity}` : "",
    opts.area ? `📊 Approx. area: ${opts.area} sq ft` : "",
    opts.surfaceMaterial ? `🧱 Surface: ${opts.surfaceMaterial}` : "",
  ].filter(Boolean)

  return [
    "Hi MountRoof team,",
    "",
    "I would like a quote for this panel configuration:",
    "",
    `📦 Product: ${opts.productName}`,
    ...details,
    `🔗 Link: ${opts.productUrl}`,
    "",
    "Please confirm availability, pricing, and delivery timeline.",
    "Thank you.",
  ].join("\n")
}

export function enquiryWhatsAppMessage(opts: {
  referenceId: string
  product: string
  name: string
  projectLocation?: string
}): string {
  return [
    "Hi MountRoof team,",
    "",
    `I just submitted enquiry *${opts.referenceId}* on your website.`,
    "",
    `👤 Name: ${opts.name}`,
    `📦 Product: ${opts.product}`,
    opts.projectLocation ? `📍 Location: ${opts.projectLocation}` : "",
    "",
    "Please get in touch to discuss pricing and next steps.",
    "Thank you.",
  ]
    .filter(Boolean)
    .join("\n")
}
