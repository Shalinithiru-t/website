import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Breadcrumb from "@/components/shared/Breadcrumb"
import ProductCard from "@/components/shared/ProductCard"
import FadeUp from "@/components/shared/FadeUp"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { products } from "@/data/products"

const filters = ["All", "Roofing", "Wall Systems", "Cold Storage", "Specialized"]

export default function ProductsList() {
  useDocumentMeta(
    "Product Range",
    "Browse MountRoof's full range of PUF sandwich panels: roofing, wall systems, cold room panels and specialized architectural panels."
  )
  const [filter, setFilter] = useState("All")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesFilter = filter === "All" || p.categoryFilter === filter
      const matchesQuery = query.trim() === "" || p.name.toLowerCase().includes(query.toLowerCase()) || p.shortDescription.toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [filter, query])

  return (
    <div>
      <div className="bg-navy py-16 text-white">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <Breadcrumb items={[{ label: "Products" }]} dark />
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Insulated Panel Products</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Explore MountRoof's complete range of PUF sandwich panels engineered for roofing, wall envelopes, cold storage and premium architectural facades.
          </p>
        </div>
      </div>

      <div className="container-1280 px-4 py-16 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  filter === f ? "border-accent bg-accent text-white" : "border-border-grey bg-white text-charcoal hover:border-navy"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="pl-9"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 60}>
              <ProductCard product={p} />
            </FadeUp>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-10 text-center text-steel">No products match your search. Try a different keyword or filter.</p>
        )}

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border-grey bg-surface p-8 text-center">
          <h2 className="text-xl font-semibold text-charcoal">Not sure which panel is right for your project?</h2>
          <p className="max-w-lg text-steel">Talk to our technical sales team for a side-by-side comparison of specifications, thermal performance and pricing across our panel range.</p>
          <Button asChild className="bg-accent hover:bg-[#D94716]">
            <Link to="/contact">Compare Products with an Expert</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
