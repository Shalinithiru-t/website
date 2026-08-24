import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { deleteProduct, fetchAdminProducts, type AdminProduct } from "@/lib/api"

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Products</h1>
          <p className="mt-1 text-sm text-steel">Create, edit and publish product pages</p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#D94716]"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add product
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void load()}
            placeholder="Search by name or slug…"
            className="w-full rounded-lg border border-border-grey bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-navy"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-border-grey bg-white px-3 py-2.5 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-border-grey bg-white px-4 py-2.5 text-sm font-medium hover:bg-surface"
        >
          Search
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border-grey bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border-grey bg-surface text-xs uppercase tracking-wide text-steel">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-steel">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-steel">
                  No products found. Seed the database or add a product.
                </td>
              </tr>
            )}
            {!loading &&
              products.map((p) => (
                <tr key={p.id} className="border-b border-border-grey last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{p.name}</p>
                    <p className="text-xs text-steel">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-steel">{p.categoryFilter}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-steel">{p.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/products/${p.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-border-grey px-2.5 py-1.5 text-xs font-medium hover:bg-surface"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void onDelete(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
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
