import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { deleteApplication, fetchAdminApplications, type AdminApplication } from "@/lib/api"
import { PageHeader } from "@/components/FormField"

export default function ApplicationsListPage() {
  const { token } = useAuth()
  const [items, setItems] = useState<AdminApplication[]>([])
  const [status, setStatus] = useState("all")
  const [q, setQ] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!token) return
    setLoading(true)
    setError("")
    try {
      const list = await fetchAdminApplications(token, {
        status: status === "all" ? undefined : status,
        q: q.trim() || undefined,
      })
      setItems(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [token, status])

  async function onDelete(item: AdminApplication) {
    if (!token) return
    if (!confirm(`Delete “${item.name}”?`)) return
    try {
      await deleteApplication(token, item.id)
      setItems((prev) => prev.filter((a) => a.id !== item.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Applications"
        description="Industry pages on the public site (Cold Storage, Warehouses, etc.)."
        action={
          <Link to="/applications/new" className="admin-btn admin-btn-primary">
            <Plus className="size-4" aria-hidden="true" />
            Add application
          </Link>
        }
      />

      <div className="admin-toolbar">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void load()}
            placeholder="Search by name or slug…"
            className="admin-input pl-9"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input sm:w-44">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button type="button" onClick={() => void load()} className="admin-btn admin-btn-secondary">
          Search
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Order</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="!py-10 text-center text-steel">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={4} className="!py-10 text-center text-steel">
                  No applications found. Click “Add application” to create one.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((a) => (
                <tr key={a.id}>
                  <td>
                    <p className="font-bold text-charcoal">{a.name}</p>
                    <p className="text-xs text-steel">/applications/{a.slug}</p>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${
                        a.status === "published" ? "admin-badge-published" : "admin-badge-draft"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="tabular-nums text-steel">{a.sortOrder}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link to={`/applications/${a.id}/edit`} className="admin-btn admin-btn-secondary !px-2.5 !py-1.5 text-xs">
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void onDelete(a)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
