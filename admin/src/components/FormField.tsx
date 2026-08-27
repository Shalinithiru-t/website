import type { ReactNode } from "react"

export const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border-grey bg-white px-3.5 py-2.5 text-sm outline-none placeholder:text-steel/60 focus:border-navy focus:ring-2 focus:ring-navy/15"

export const labelClass = "block text-sm font-bold text-charcoal"

export const hintClass = "mt-1.5 text-[13px] leading-snug text-[#3d4a57]"

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className={hintClass}>{children}</p>
}

export function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5 rounded-xl bg-[#f4f7fa] px-4 py-3">
      <h3 className="text-sm font-extrabold uppercase tracking-[0.06em] text-navy">{title}</h3>
      {desc && <p className="mt-1 text-sm text-steel">{desc}</p>}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="admin-page-header">
      <div>
        <h2 className="admin-page-title">{title}</h2>
        {description && <p className="admin-page-desc">{description}</p>}
      </div>
      {action}
    </div>
  )
}
