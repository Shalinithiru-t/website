import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

export interface Crumb {
  label: string
  to?: string
}

export default function Breadcrumb({ items, dark }: { items: Crumb[]; dark?: boolean }) {
  const base = dark ? "text-white/70" : "text-steel"
  const linkColor = dark ? "hover:text-white" : "hover:text-navy"
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-sm ${base}`}>
      <Link to="/" className={linkColor}>Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5" aria-hidden="true" />
          {item.to ? (
            <Link to={item.to} className={linkColor}>{item.label}</Link>
          ) : (
            <span aria-current="page" className={dark ? "text-white" : "text-charcoal"}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
