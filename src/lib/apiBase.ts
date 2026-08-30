/** Public API origin. Locally the Vite proxy handles `/api`; production needs the Render URL. */
const PRODUCTION_API = "https://website-2-4mvu.onrender.com"

export function apiBase(): string {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
  if (envUrl) return envUrl.replace(/\/$/, "")
  if (import.meta.env.PROD) return PRODUCTION_API
  return ""
}
