import type { Enquiry } from "@/types"

const STORAGE_KEY = "mountroof_enquiries"

export function submitEnquiry(data: Omit<Enquiry, "id" | "createdAt">): Promise<Enquiry> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const enquiry: Enquiry = {
        ...data,
        id: `MR-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
      }
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log("MountRoof enquiry submitted:", enquiry)
      }
      try {
        const existingRaw = localStorage.getItem(STORAGE_KEY)
        const existing: Enquiry[] = existingRaw ? JSON.parse(existingRaw) : []
        existing.push(enquiry)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
      } catch {
        // localStorage unavailable - fail silently, enquiry object still returned
      }
      resolve(enquiry)
    }, 800)
  })
}

export const phoneRegex = /^[6-9]\d{9}$/
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
