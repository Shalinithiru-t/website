import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { Menu, X, ChevronDown, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navProducts, navApplications } from "@/data/site"
import { useSiteInfo } from "@/context/SiteInfoContext"

function Dropdown({
  label,
  items,
  path,
  light,
}: {
  label: string
  items: { label: string; to: string }[]
  path: string
  light?: boolean
}) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const active = location.pathname.startsWith(path)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`flex items-center gap-1 py-2 text-sm font-medium transition hover:text-accent ${
          active ? "text-accent" : light ? "text-white" : "text-charcoal"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false)
        }}
      >
        {label}
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-40 min-w-64 rounded-xl border border-border-grey bg-white py-2 shadow-lg"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false)
          }}
        >
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-4 py-2.5 text-sm text-charcoal hover:bg-surface hover:text-accent"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link to={path} className="block border-t border-border-grey px-4 py-2.5 text-sm font-medium text-navy hover:text-accent">
            View All {label}
          </Link>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const location = useLocation()
  const siteInfo = useSiteInfo()
  const isHome = location.pathname === "/"
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [mobileAppsOpen, setMobileAppsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setScrolled(window.scrollY > 24)
  }, [location.pathname])

  // Overlay hero only on home while at top — otherwise solid white with dark text
  const overHero = isHome && !scrolled && !mobileOpen

  return (
    <header
      className={`inset-x-0 top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        overHero
          ? "border-transparent bg-transparent shadow-none backdrop-blur-none"
          : "border-transparent bg-white/95 shadow-sm backdrop-blur"
      }`}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        zIndex: 50,
        ...(overHero ? { backgroundColor: "transparent" } : {}),
      }}
    >
      <div
        className={`container-1440 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10 ${
          overHero ? "text-white" : "text-charcoal"
        }`}
      >
        <Link
          to="/"
          className={`flex items-center gap-2 text-lg font-extrabold tracking-tight ${
            overHero ? "text-white" : "text-charcoal"
          }`}
        >
          <span
            className={`flex size-9 items-center justify-center rounded-md ${
              overHero ? "bg-white text-navy" : "bg-navy text-white"
            }`}
          >
            M
          </span>
          MountRoof
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Dropdown label="Products" items={navProducts} path="/products" light={overHero} />
          <Dropdown label="Applications" items={navApplications} path="/applications" light={overHero} />
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `text-sm font-medium hover:text-accent ${isActive ? "text-accent" : overHero ? "text-white" : "text-charcoal"}`
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/resources"
            className={({ isActive }) =>
              `text-sm font-medium hover:text-accent ${isActive ? "text-accent" : overHero ? "text-white" : "text-charcoal"}`
            }
          >
            Resources
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm font-medium hover:text-accent ${isActive ? "text-accent" : overHero ? "text-white" : "text-charcoal"}`
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-sm font-medium hover:text-accent ${isActive ? "text-accent" : overHero ? "text-white" : "text-charcoal"}`
            }
          >
            Contact
          </NavLink>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={siteInfo.phoneHref}
            className={`flex items-center gap-1.5 text-sm font-medium hover:text-accent ${
              overHero ? "text-white" : "text-charcoal"
            }`}
          >
            <Phone className="size-4" aria-hidden="true" />
            {siteInfo.phone}
          </a>
          <Button asChild className="bg-accent hover:bg-[#D94716]">
            <Link to="/enquire">Get a Quote</Link>
          </Button>
        </div>

        <div className={`flex items-center gap-3 lg:hidden ${overHero ? "text-white" : "text-charcoal"}`}>
          <a href={siteInfo.phoneHref} aria-label="Call MountRoof">
            <Phone className="size-5" />
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-6 text-charcoal" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-border-grey bg-white px-4 pb-8 pt-2 text-charcoal lg:hidden">
          <button
            type="button"
            className="flex w-full items-center justify-between border-b border-border-grey py-3 text-left font-medium"
            onClick={() => setMobileProductsOpen((o) => !o)}
            aria-expanded={mobileProductsOpen}
          >
            Products <ChevronDown className={`size-4 transition ${mobileProductsOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileProductsOpen && (
            <div className="flex flex-col gap-1 py-2 pl-3">
              {navProducts.map((p) => (
                <Link key={p.to} to={p.to} className="py-2 text-sm text-steel hover:text-accent">
                  {p.label}
                </Link>
              ))}
              <Link to="/products" className="py-2 text-sm font-medium text-navy">
                View All Products
              </Link>
            </div>
          )}

          <button
            type="button"
            className="flex w-full items-center justify-between border-b border-border-grey py-3 text-left font-medium"
            onClick={() => setMobileAppsOpen((o) => !o)}
            aria-expanded={mobileAppsOpen}
          >
            Applications <ChevronDown className={`size-4 transition ${mobileAppsOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileAppsOpen && (
            <div className="flex flex-col gap-1 py-2 pl-3">
              {navApplications.map((a) => (
                <Link key={a.to} to={a.to} className="py-2 text-sm text-steel hover:text-accent">
                  {a.label}
                </Link>
              ))}
              <Link to="/applications" className="py-2 text-sm font-medium text-navy">
                View All Applications
              </Link>
            </div>
          )}

          <Link to="/projects" className="block border-b border-border-grey py-3 font-medium">
            Projects
          </Link>
          <Link to="/resources" className="block border-b border-border-grey py-3 font-medium">
            Resources
          </Link>
          <Link to="/about" className="block border-b border-border-grey py-3 font-medium">
            About Us
          </Link>
          <Link to="/contact" className="block border-b border-border-grey py-3 font-medium">
            Contact
          </Link>

          <Button asChild className="mt-4 w-full bg-accent hover:bg-[#D94716]">
            <Link to="/enquire">Get a Quote</Link>
          </Button>
        </div>
      )}
    </header>
  )
}
