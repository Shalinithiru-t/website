import { NavLink, Outlet } from "react-router-dom"
import { LayoutDashboard, Package, FileText, Inbox, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, soon: false },
  { to: "/products", label: "Products", icon: Package, soon: false },
  { to: "/blogs", label: "Blogs", icon: FileText, soon: false },
  { to: "/enquiries", label: "Enquiries", icon: Inbox, soon: true },
  { to: "/settings", label: "Settings", icon: Settings, soon: true },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col bg-navy text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-lg font-bold tracking-tight">MountRoof</p>
          <p className="text-xs text-white/60">Admin · Phase 2</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {item.soon && (
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/50">
                  Soon
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-white/50">{user?.email}</p>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
