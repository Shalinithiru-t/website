import type { Enquiry } from "@/types"
import { apiBase } from "@/lib/apiBase"

export type EnquirySubmitInput = Omit<Enquiry, "id" | "createdAt"> & {
  projectType: string
  source?: "home" | "enquire" | "contact" | "product" | "configurator" | "other"
  productSlug?: string
  productUrl?: string
}

export async function submitEnquiry(data: EnquirySubmitInput): Promise<Enquiry> {
  let res: Response
  try {
    res = await fetch(`${apiBase()}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        consent: true,
      }),
    })
  } catch {
    throw new Error("Cannot reach the API. Start the server with npm run dev in the server folder.")
  }

  const text = await res.text()
  let body: { success?: boolean; message?: string; enquiry?: Enquiry } = {}
  if (text) {
    try {
      body = JSON.parse(text) as typeof body
    } catch {
      throw new Error("The API is not running or returned an invalid response. In the server folder run: npm run dev")
    }
  } else if (!res.ok) {
    throw new Error("The API is not running. In the server folder run: npm run dev")
  }

  if (!res.ok || !body.enquiry) {
    throw new Error(body.message || `Enquiry submission failed (${res.status})`)
  }
  return body.enquiry
}

export const phoneRegex = /^[6-9]\d{9}$/
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
