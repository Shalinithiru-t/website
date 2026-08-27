import type { ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import MobileStickyBar from "@/components/layout/MobileStickyBar"

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      {/* Fixed header overlays content — pad non-home pages; home hero goes edge-to-edge under header */}
      <main
        id="main-content"
        className={`flex-1 pb-16 lg:pb-0 ${location.pathname === "/" ? "" : "pt-[72px]"}`}
      >
        {children}
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  )
}
