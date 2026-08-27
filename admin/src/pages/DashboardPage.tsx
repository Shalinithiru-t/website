import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Package, FileText, Inbox, Building2, Briefcase, MessageCircle, TrendingUp, ArrowUpRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { fetchDashboard, type DashboardStats } from "@/lib/api"

function BarRow({
  label,
  value,
  max,
  color = "bg-navy",
}: {
  label: string
  value: number
  max: number
  color?: string
}) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 4 : 0) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-medium text-charcoal">{label}</span>
        <span className="shrink-0 tabular-nums font-bold text-navy">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function formatDay(iso: string) {
  const d = new Date(iso + "T12:00:00")
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetchDashboard(token)
      .then(setStats)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load dashboard"))
      .finally(() => setLoading(false))
  }, [token])

  const a = stats?.analytics
  const trendMax = Math.max(1, ...(a?.dailyTrend.map((d) => d.enquiries + d.whatsapp) ?? [1]))
  const statusEntries = a ? (Object.entries(a.enquiriesByStatus) as [string, number][]) : []
  const statusMax = Math.max(1, ...statusEntries.map(([, v]) => v))
  const sourceMax = Math.max(1, ...(a?.enquiriesBySource.map((s) => s.count) ?? [1]))
  const waSourceMax = Math.max(1, ...(a?.whatsappBySource.map((s) => s.count) ?? [1]))
  const productMax = Math.max(1, ...(a?.topProducts.map((p) => p.count) ?? [1]))

  const cards = [
    {
      label: "Products",
      value: stats?.products ?? 0,
      icon: Package,
      note: stats?.productsPublished != null ? `${stats.productsPublished} published` : "—",
      to: "/products",
      tint: "bg-navy/5 text-navy",
    },
    {
      label: "Applications",
      value: stats?.applications ?? 0,
      icon: Building2,
      note: "Industry pages",
      to: "/applications",
      tint: "bg-navy/5 text-navy",
    },
    {
      label: "Projects",
      value: stats?.projects ?? 0,
      icon: Briefcase,
      note: "Case studies",
      to: "/projects",
      tint: "bg-navy/5 text-navy",
    },
    {
      label: "Blogs",
      value: stats?.blogs ?? 0,
      icon: FileText,
      note: stats?.blogsPublished != null ? `${stats.blogsPublished} published` : "—",
      to: "/blogs",
      tint: "bg-navy/5 text-navy",
    },
    {
      label: "New form leads",
      value: stats?.enquiriesNew ?? 0,
      icon: Inbox,
      note: a ? `${a.enquiriesLast7} in 7 days` : "Form enquiries",
      to: "/enquiries",
      tint: "bg-blue-50 text-blue-700",
    },
    {
      label: "New WhatsApp",
      value: stats?.whatsappLeadsNew ?? 0,
      icon: MessageCircle,
      note: a ? `${a.whatsappLast7} in 7 days` : "Book Now clicks",
      to: "/enquiries",
      tint: "bg-[#25D366]/15 text-[#128C7E]",
    },
  ]

  return (
    <div className="admin-page">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="admin-page-title">Lead & content overview</h2>
          <p className="admin-page-desc">Welcome back, {user?.name}. Live analytics from your MountRoof CMS.</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-steel">Last 14 days trend</p>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && <p className="mb-4 text-sm text-steel">Loading analytics…</p>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="admin-card group p-4 transition hover:-translate-y-0.5 hover:border-navy/30"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-steel">{card.label}</p>
                <p className="mt-2 text-3xl font-extrabold tabular-nums text-navy">{card.value}</p>
                <p className="mt-1 text-xs text-steel">{card.note}</p>
              </div>
              <span className={`rounded-xl p-2.5 ${card.tint}`}>
                <card.icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent opacity-0 transition group-hover:opacity-100">
              Open <ArrowUpRight className="size-3.5" />
            </span>
          </Link>
        ))}
      </div>

      {a && (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Form enquiries",
                value: a.enquiriesTotal,
                note: `${a.enquiriesLast30} / 30d · ${a.enquiriesLast7} / 7d`,
              },
              {
                label: "WhatsApp clicks",
                value: a.whatsappTotal,
                note: `${a.whatsappLast30} / 30d · ${a.whatsappLast7} / 7d`,
              },
              {
                label: "Quoted + closed",
                value: a.enquiriesByStatus.quoted + a.enquiriesByStatus.closed,
                note: `${a.enquiriesByStatus.contacted} contacted`,
              },
              {
                label: "14-day volume",
                value: a.dailyTrend.reduce((s, d) => s + d.enquiries + d.whatsapp, 0),
                note: "Form + WhatsApp",
                icon: true,
              },
            ].map((item) => (
              <div key={item.label} className="admin-card p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-steel">
                  {item.icon && <TrendingUp className="size-3.5" aria-hidden="true" />}
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-extrabold tabular-nums text-navy">{item.value}</p>
                <p className="mt-1 text-xs text-steel">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="admin-card mt-5 p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-navy">Leads — last 14 days</h3>
              <div className="flex gap-4 text-xs font-medium text-steel">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-navy" /> Form
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-[#25D366]" /> WhatsApp
                </span>
              </div>
            </div>
            <div className="flex h-44 items-end gap-1.5 sm:gap-2">
              {a.dailyTrend.map((day) => {
                const total = day.enquiries + day.whatsapp
                const h = Math.max(total > 0 ? (total / trendMax) * 100 : 0, total > 0 ? 8 : 3)
                const formShare = total > 0 ? (day.enquiries / total) * 100 : 0
                return (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                    <div
                      className="flex w-full max-w-8 flex-col justify-end overflow-hidden rounded-t-md bg-surface sm:max-w-none"
                      style={{ height: `${h}%`, minHeight: 6 }}
                      title={`${formatDay(day.date)}: ${day.enquiries} form, ${day.whatsapp} WhatsApp`}
                    >
                      {total > 0 && (
                        <>
                          <div className="w-full bg-[#25D366]" style={{ height: `${100 - formShare}%` }} />
                          <div className="w-full bg-navy" style={{ height: `${formShare}%` }} />
                        </>
                      )}
                    </div>
                    <span className="hidden text-[10px] font-medium text-steel sm:block">
                      {formatDay(day.date).split(" ")[1]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="admin-card p-5">
              <h3 className="mb-4 text-base font-bold text-navy">Enquiry status</h3>
              <div className="space-y-3.5">
                {statusEntries.map(([label, value]) => (
                  <BarRow
                    key={label}
                    label={label}
                    value={value}
                    max={statusMax}
                    color={
                      label === "new"
                        ? "bg-blue-500"
                        : label === "contacted"
                          ? "bg-amber-500"
                          : label === "quoted"
                            ? "bg-green-500"
                            : label === "spam"
                              ? "bg-red-400"
                              : "bg-steel"
                    }
                  />
                ))}
              </div>
            </div>

            <div className="admin-card p-5">
              <h3 className="mb-4 text-base font-bold text-navy">Form sources</h3>
              {a.enquiriesBySource.length === 0 ? (
                <p className="text-sm text-steel">No form enquiries yet.</p>
              ) : (
                <div className="space-y-3.5">
                  {a.enquiriesBySource.map((s) => (
                    <BarRow key={s.source} label={s.source} value={s.count} max={sourceMax} color="bg-accent" />
                  ))}
                </div>
              )}
              <h3 className="mb-4 mt-8 text-base font-bold text-navy">WhatsApp sources</h3>
              {a.whatsappBySource.length === 0 ? (
                <p className="text-sm text-steel">No WhatsApp clicks yet.</p>
              ) : (
                <div className="space-y-3.5">
                  {a.whatsappBySource.map((s) => (
                    <BarRow key={s.source} label={s.source} value={s.count} max={waSourceMax} color="bg-[#25D366]" />
                  ))}
                </div>
              )}
            </div>

            <div className="admin-card p-5">
              <h3 className="mb-4 text-base font-bold text-navy">Top products (forms)</h3>
              {a.topProducts.length === 0 ? (
                <p className="text-sm text-steel">No product enquiries yet.</p>
              ) : (
                <div className="space-y-3.5">
                  {a.topProducts.map((p) => (
                    <BarRow key={p.product} label={p.product} value={p.count} max={productMax} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="admin-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-navy">Recent form enquiries</h3>
                <Link to="/enquiries" className="text-xs font-bold text-accent hover:underline">
                  View all
                </Link>
              </div>
              {a.recentEnquiries.length === 0 ? (
                <p className="text-sm text-steel">No enquiries yet.</p>
              ) : (
                <ul className="divide-y divide-border-grey">
                  {a.recentEnquiries.map((e) => (
                    <li key={e.id} className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-charcoal">{e.name}</p>
                        <p className="truncate text-xs text-steel">
                          {e.product} · {e.projectLocation}
                        </p>
                        <p className="mt-0.5 text-[11px] text-steel">
                          {e.createdAt ? new Date(e.createdAt).toLocaleString() : ""}
                        </p>
                      </div>
                      <Link
                        to={`/enquiries/${e.id}`}
                        className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700"
                      >
                        {e.status}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="admin-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-navy">Recent WhatsApp clicks</h3>
                <Link to="/enquiries" className="text-xs font-bold text-accent hover:underline">
                  View all
                </Link>
              </div>
              {a.recentWhatsApp.length === 0 ? (
                <p className="text-sm text-steel">No WhatsApp clicks yet.</p>
              ) : (
                <ul className="divide-y divide-border-grey">
                  {a.recentWhatsApp.map((l) => (
                    <li key={l.id} className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-charcoal">{l.product || "WhatsApp interest"}</p>
                        <p className="truncate text-xs text-steel">
                          {l.source} · {l.referenceId}
                        </p>
                        <p className="mt-0.5 text-[11px] text-steel">
                          {l.createdAt ? new Date(l.createdAt).toLocaleString() : ""}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#25D366]/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#128C7E]">
                        {l.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
