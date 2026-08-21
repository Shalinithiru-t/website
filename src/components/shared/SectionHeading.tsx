export default function SectionHeading({
  eyebrow,
  title,
  description,
  center,
}: {
  eyebrow?: string
  title: string
  description?: string
  center?: boolean
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-steel">{description}</p>}
    </div>
  )
}
