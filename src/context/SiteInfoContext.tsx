import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { defaultLiveSiteInfo, fetchSiteSettings, type LiveSiteInfo } from "@/lib/siteSettingsApi"
import { setWhatsAppPhoneDigits } from "@/lib/whatsapp"

const SiteInfoContext = createContext<LiveSiteInfo>(defaultLiveSiteInfo())

export function SiteInfoProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<LiveSiteInfo>(defaultLiveSiteInfo())

  useEffect(() => {
    let cancelled = false
    fetchSiteSettings().then((next) => {
      if (cancelled) return
      setWhatsAppPhoneDigits(next.whatsappDigits)
      setInfo(next)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return <SiteInfoContext.Provider value={info}>{children}</SiteInfoContext.Provider>
}

export function useSiteInfo(): LiveSiteInfo {
  return useContext(SiteInfoContext)
}
