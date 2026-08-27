import { useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  FileText,
  Inbox,
  Settings,
  LogOut,
  Building2,
  Briefcase,
  Menu,
  X,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  { to: "/applications", label: "Applications", icon: Building2 },
  { to: "/projects", label: "Projects", icon: Briefcase },
  { to: "/blogs", label: "Blogs", icon: FileText },
  { to: "/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/settings", label: "Settings", icon: Settings },
]

function pageTitle(pathname: string) {
  if (pathname === "/") return "Dashboard"
  if (pathname.startsWith("/products")) return "Products"
  if (pathname.startsWith("/applications")) return "Applications"
  if (pathname.startsWith("/projects")) return "Projects"
  if (pathname.startsWith("/blogs")) return "Blogs"
  if (pathname.startsWith("/enquiries")) return "Enquiries"
  if (pathname.startsWith("/settings")) return "Settings"
  return "Admin"
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    setMobileOpen(false)
    await logout()
  }

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-base font-extrabold text-white shadow-sm">
            M
          </span>
          <div>
            <p className="text-lg font-extrabold tracking-tight">MountRoof</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
              Admin
            </p>
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
          Menu
        </p>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                isActive
                  ? "bg-accent text-white shadow-md shadow-black/20"
                  : "text-white/75 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
          >
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/8 px-3 py-3 ring-1 ring-white/10">
          <p className="truncate text-sm font-bold text-white">{user?.name}</p>
          <p className="truncate text-xs text-white/50">{user?.email}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <aside className="relative z-30 hidden h-screen w-[248px] shrink-0 flex-col bg-gradient-to-b from-navy to-navy-mid text-white lg:flex">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/55 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex h-full w-[248px] flex-col bg-gradient-to-b from-navy to-navy-mid text-white shadow-2xl">
            <button
              type="button"
              className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-white/70 hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            {sidebar}
            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="admin-btn admin-btn-primary w-full"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-20 shrink-0 border-b border-border-grey bg-white">
          <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-7 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-border-grey p-2 text-navy lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-steel">
                  MountRoof CMS
                </p>
                <h1 className="text-lg font-extrabold text-navy">{pageTitle(location.pathname)}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden rounded-xl border border-border-grey bg-surface px-3 py-1.5 sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wide text-steel">Signed in</p>
                <p className="max-w-[200px] truncate text-xs font-semibold text-navy">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex items-center gap-2 rounded-xl bg-navy px-3.5 py-2.5 text-sm font-bold text-white hover:bg-navy-mid"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Log out
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
