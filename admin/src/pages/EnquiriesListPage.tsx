import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Search, Eye, MessageCircle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import {
  fetchAdminEnquiries,
  fetchAdminWhatsAppLeads,
  updateAdminWhatsAppLead,
  type AdminEnquiry,
  type AdminWhatsAppLead,
  type WhatsAppLeadStatus,
} from "@/lib/api"

const formStatuses = ["all", "new", "contacted", "quoted", "closed", "spam"] as const
const waStatuses = ["all", "new", "contacted", "closed"] as const

export default function EnquiriesListPage() {
  const { token } = useAuth()
  const [tab, setTab] = useState<"form" | "whatsapp">("form")

  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([])
  const [leads, setLeads] = useState<AdminWhatsAppLead[]>([])
  const [status, setStatus] = useState("all")
  const [q, setQ] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!token) return
    setLoading(true)
    setError("")
    try {
      if (tab === "form") {
        const list = await fetchAdminEnquiries(token, {
          status: status === "all" ? undefined : status,
          q: q.trim() || undefined,
        })
        setEnquiries(list)
      } else {
        const list = await fetchAdminWhatsAppLeads(token, {
          status: status === "all" ? undefined : status,
          q: q.trim() || undefined,
        })
        setLeads(list)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setStatus("all")
    setQ("")
  }, [tab])

  useEffect(() => {
    void load()
  }, [token, status, tab])

  async function setLeadStatus(id: string, next: WhatsAppLeadStatus) {
    if (!token) return
    try {
      const updated = await updateAdminWhatsAppLead(token, id, { status: next })
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed")
    }
  }

  return (
    <div className="admin-page">
      <div className="mb-5">
        <h2 className="admin-page-title">Enquiries</h2>
        <p className="admin-page-desc">
          Form submissions and WhatsApp Book Now / chat clicks from the website
        </p>
      </div>

      <div className="mb-4 flex gap-1 rounded-xl border border-border-grey bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("form")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            tab === "form" ? "bg-navy text-white" : "text-steel hover:text-navy"
          }`}
        >
          Form enquiries
        </button>
        <button
          type="button"
          onClick={() => setTab("whatsapp")}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            tab === "whatsapp" ? "bg-navy text-white" : "text-steel hover:text-navy"
          }`}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          WhatsApp clicks
        </button>
      </div>

      <div className="admin-toolbar mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void load()}
            placeholder={
              tab === "form"
                ? "Search name, phone, product, reference…"
                : "Search product, reference, message…"
            }
            className="admin-input pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="admin-input sm:w-44"
        >
          {(tab === "form" ? formStatuses : waStatuses).map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void load()}
          className="admin-btn admin-btn-secondary"
        >
          Search
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {tab === "form" ? (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Contact</th>
                <th>Product</th>
                <th>Location</th>
                <th>Status</th>
                <th>Email</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="!py-10 text-center text-steel">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && enquiries.length === 0 && (
                <tr>
                  <td colSpan={7} className="!py-10 text-center text-steel">
                    No form enquiries yet.
                  </td>
                </tr>
              )}
              {!loading &&
                enquiries.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <p className="font-semibold text-charcoal">{e.referenceId}</p>
                      <p className="text-xs text-steel">
                        {e.createdAt ? new Date(e.createdAt).toLocaleString() : ""}
                      </p>
                    </td>
                    <td>
                      <p className="font-semibold">{e.name}</p>
                      <p className="text-xs text-steel">{e.phone}</p>
                    </td>
                    <td className="text-steel">{e.product}</td>
                    <td className="text-steel">{e.projectLocation}</td>
                    <td>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          e.status === "new"
                            ? "bg-blue-50 text-blue-700"
                            : e.status === "contacted"
                              ? "bg-amber-50 text-amber-700"
                              : e.status === "quoted"
                                ? "bg-green-50 text-green-700"
                                : "bg-surface text-steel"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="text-xs text-steel">{e.emailSent ? "Sent" : "Not sent"}</td>
                    <td className="text-right">
                      <Link to={`/enquiries/${e.id}`} className="admin-btn admin-btn-secondary !px-2.5 !py-1.5 text-xs">
                        <Eye className="size-3.5" aria-hidden="true" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Source</th>
                <th>Product / config</th>
                <th>Message preview</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="!py-10 text-center text-steel">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="!py-10 text-center text-steel">
                    No WhatsApp clicks yet. Use Book Now on a product page to test.
                  </td>
                </tr>
              )}
              {!loading &&
                leads.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <p className="font-semibold text-charcoal">{l.referenceId}</p>
                      <p className="text-xs text-steel">
                        {l.createdAt ? new Date(l.createdAt).toLocaleString() : ""}
                      </p>
                      {l.enquiryReferenceId && (
                        <p className="mt-1 text-xs text-steel">Form: {l.enquiryReferenceId}</p>
                      )}
                    </td>
                    <td>
                      <span className="rounded-full bg-[#25D366]/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#128C7E]">
                        {l.source}
                      </span>
                    </td>
                    <td>
                      <p className="font-semibold text-charcoal">{l.product || "—"}</p>
                      {(l.colour || l.thickness) && (
                        <p className="mt-1 text-xs text-steel">
                          {[l.colour, l.thickness, l.length ? `${l.length}m` : "", l.quantity]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                      {l.productUrl && (
                        <a
                          href={l.productUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-xs font-semibold text-accent hover:underline"
                        >
                          Open page
                        </a>
                      )}
                    </td>
                    <td className="max-w-xs text-xs text-steel whitespace-pre-wrap">
                      {l.message ? l.message.slice(0, 180) + (l.message.length > 180 ? "…" : "") : "—"}
                    </td>
                    <td>
                      <select
                        value={l.status}
                        onChange={(e) => void setLeadStatus(l.id, e.target.value as WhatsAppLeadStatus)}
                        className="admin-input !py-1.5 text-xs"
                      >
                        <option value="new">new</option>
                        <option value="contacted">contacted</option>
                        <option value="closed">closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
