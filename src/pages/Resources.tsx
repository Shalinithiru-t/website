import Breadcrumb from "@/components/shared/Breadcrumb"
import FadeUp from "@/components/shared/FadeUp"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { resources } from "@/data/resources"

export default function Resources() {
  useDocumentMeta(
    "Resources",
    "Technical guides and planning resources for specifying insulated PUF panels, roofing and cold storage building envelopes."
  )

  return (
    <div>
      <div className="bg-navy py-16 text-white">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <Breadcrumb items={[{ label: "Resources" }]} dark />
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Technical Resources &amp; Guides</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Practical, technical guidance to help you specify, plan and budget your insulated building envelope with confidence.
          </p>
        </div>
      </div>

      <div className="container-1280 px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r, i) => (
            <FadeUp key={r.slug} delay={i * 70} className="flex flex-col overflow-hidden rounded-2xl border border-border-grey bg-white">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={r.image} alt={r.title} loading="lazy" className="size-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs text-steel">
                  <span className="rounded-full bg-surface px-2.5 py-1 font-medium text-navy">{r.category}</span>
                  <span>{r.readTime}</span>
                  <span>{r.date}</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-charcoal">{r.title}</h2>
                <p className="mt-2 flex-1 text-sm text-steel">{r.excerpt}</p>
                <div className="mt-4 space-y-2.5 border-t border-border-grey pt-4 text-sm text-steel">
                  {r.content.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  )
}
