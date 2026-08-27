import type { Enquiry } from "@/types"

export type EnquirySubmitInput = Omit<Enquiry, "id" | "createdAt"> & {
  projectType: string
  source?: "home" | "enquire" | "contact" | "product" | "configurator" | "other"
  productSlug?: string
  productUrl?: string
}

function apiBase(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  return envUrl?.replace(/\/$/, "") || ""
}

export function submitEnquiry(data: EnquirySubmitInput): Promise<Enquiry> {
  return fetch(`${apiBase()}/api/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      consent: true,
    }),
  }).then(async (res) => {
    const body = (await res.json()) as {
      success?: boolean
      message?: string
      enquiry?: Enquiry
    }
    if (!res.ok || !body.enquiry) {
      throw new Error(body.message || `Enquiry submission failed (${res.status})`)
    }
    return body.enquiry
  })
}

export const phoneRegex = /^[6-9]\d{9}$/
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
