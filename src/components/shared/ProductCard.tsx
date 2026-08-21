import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/types"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border-grey bg-white transition hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={product.images[0].url}
          alt={product.images[0].alt}
          loading="lazy"
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">{product.category}</span>
        <h3 className="mt-1 text-lg font-semibold text-charcoal">{product.shortName}</h3>
        <p className="mt-2 flex-1 text-sm text-steel">{product.shortDescription}</p>
        <span className="mt-3 inline-block w-fit rounded-full bg-surface px-3 py-1 text-xs font-medium text-navy">
          {product.specifications["Core Thickness"]}
        </span>
        <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-accent">
          View Product Details <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
