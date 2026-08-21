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
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  )
}
