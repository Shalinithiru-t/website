import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { deleteProduct, fetchAdminProducts, type AdminProduct } from "@/lib/api"
import { PageHeader } from "@/components/FormField"

export default function ProductsListPage() {
  const { token } = useAuth()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [status, setStatus] = useState("all")
  const [q, setQ] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!token) return
    setLoading(true)
    setError("")
    try {
      const list = await fetchAdminProducts(token, {
        status: status === "all" ? undefined : status,
        q: q.trim() || undefined,
      })
      setProducts(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [token, status])

  async function onDelete(product: AdminProduct) {
    if (!token) return
    if (!confirm(`Delete “${product.name}”? This cannot be undone.`)) return
    try {
      await deleteProduct(token, product.id)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  return (
    <div className="admin-page">
      <PageHeader
        title="Products"
        description="Create, edit and publish product pages for the public website."
        action={
          <Link to="/products/new" className="admin-btn admin-btn-primary">
            <Plus className="size-4" aria-hidden="true" />
            Add product
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
              <th>Product</th>
              <th>Category</th>
              <th>Status</th>
              <th>Order</th>
              <th className="text-right">Actions</th>
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
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="!py-10 text-center text-steel">
                  No products found. Seed the database or add a product.
                </td>
              </tr>
            )}
            {!loading &&
              products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <p className="font-bold text-charcoal">{p.name}</p>
                    <p className="text-xs text-steel">/products/{p.slug}</p>
                  </td>
                  <td className="text-steel">{p.categoryFilter}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        p.status === "published" ? "admin-badge-published" : "admin-badge-draft"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="tabular-nums text-steel">{p.sortOrder}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link to={`/products/${p.id}/edit`} className="admin-btn admin-btn-secondary !px-2.5 !py-1.5 text-xs">
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void onDelete(p)}
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
