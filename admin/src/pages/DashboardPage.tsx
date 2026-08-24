import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Package, FileText, Inbox } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { fetchDashboard, type DashboardStats } from "@/lib/api"

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) return
    fetchDashboard(token)
      .then(setStats)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load dashboard"))
  }, [token])

  const cards = [
    {
      label: "Products",
      value: stats?.products ?? 0,
      icon: Package,
      note: stats?.productsPublished != null ? `${stats.productsPublished} published` : "Live",
      to: "/products",
    },
    {
      label: "Blogs",
      value: stats?.blogs ?? 0,
      icon: FileText,
      note: stats?.blogsPublished != null ? `${stats.blogsPublished} published` : "Live",
      to: "/blogs",
    },
    { label: "New enquiries", value: stats?.enquiriesNew ?? 0, icon: Inbox, note: "Phase 3", to: "/enquiries" },
  ]

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="mt-1 text-steel">Welcome back, {user?.name}. Products & Blogs CMS are live (Phase 2).</p>
      </header>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-2xl border border-border-grey bg-white p-5 shadow-sm transition hover:border-navy"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-steel">{card.label}</p>
              <card.icon className="size-5 text-navy/40" aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold text-navy">{card.value}</p>
            <p className="mt-1 text-xs text-steel">{card.note}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
