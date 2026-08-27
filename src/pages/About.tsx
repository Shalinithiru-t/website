import { Award, Factory, ShieldCheck, Users } from "lucide-react"
import Breadcrumb from "@/components/shared/Breadcrumb"
import FadeUp from "@/components/shared/FadeUp"
import JsonLd from "@/components/shared/JsonLd"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { stats } from "@/data/site"
import { useSiteInfo } from "@/context/SiteInfoContext"

const values = [
  { title: "Engineering First", description: "Every panel is specified against real structural and thermal requirements, not just catalogue defaults.", icon: ShieldCheck },
  { title: "Manufacturing Discipline", description: "Consistent tolerances and quality control across every production batch.", icon: Factory },
  { title: "Partnership Over Transactions", description: "We work alongside architects, contractors and facility teams from design through handover.", icon: Users },
  { title: "Certified Processes", description: "ISO-certified manufacturing processes underpin every panel we ship.", icon: Award },
]

const capabilities = [
  "In-house PUF/PIR panel line manufacturing",
  "Custom colour and surface-material matching",
  "Technical span and thermal design support",
  "Pan-India logistics and delivery scheduling",
  "On-site installation guidance and coordination",
  "Post-installation technical support",
]

export default function About() {
  useDocumentMeta(
    "About Us",
    "MountRoof (Mount Roofing & Structures Pvt. Ltd.) is India's insulated building solutions partner, manufacturing PUF panels, roofing and PEB systems."
  )
  const siteInfo = useSiteInfo()

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteInfo.legalName,
          alternateName: siteInfo.brandName,
          foundingLocation: "Bengaluru, Karnataka, India",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
        }}
      />

      <div className="bg-navy py-16 text-white">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <Breadcrumb items={[{ label: "About Us" }]} dark />
          <h1 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">Building India's Insulated Infrastructure, One Panel at a Time</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            {siteInfo.legalName} has spent over a decade engineering insulated building envelopes for India's warehousing, cold chain and industrial sectors.
          </p>
        </div>
      </div>

      <div className="container-1280 grid gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-10">
        <FadeUp>
          <h2 className="text-2xl font-bold text-charcoal">Our Story</h2>
          <p className="mt-4 text-steel">
            MountRoof began as a manufacturer of standard roofing sheets and grew into a full insulated panel systems company as India's warehousing and cold-chain sectors industrialised. Today, Mount Roofing &amp; Structures Pvt. Ltd. manufactures PUF sandwich panels, roofing systems, wall cladding, cold-room panels and supplies PEB structures to project developers, EPC contractors and facility owners across the country.
          </p>
          <p className="mt-4 text-steel">
            Our approach is engineering-led: every project starts with a conversation about your building's actual thermal, structural and operational requirements, not a generic catalogue thickness. That discipline is why MountRoof panels have shipped to over 2,000 project sites nationwide.
          </p>
        </FadeUp>
        <FadeUp delay={100}>
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1400&auto=format&fit=crop"
            alt="MountRoof manufacturing facility"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        </FadeUp>
      </div>

      <div className="bg-surface py-20">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <h2 className="text-2xl font-bold text-charcoal">Our Values</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <FadeUp key={v.title} delay={i * 70} className="rounded-xl border border-border-grey bg-white p-5">
                <v.icon className="size-6 text-accent" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-charcoal">{v.title}</h3>
                <p className="mt-1.5 text-sm text-steel">{v.description}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      <div className="container-1280 grid gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-10">
        <FadeUp>
          <h2 className="text-2xl font-bold text-charcoal">Capabilities</h2>
          <ul className="mt-5 space-y-3">
            {capabilities.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-charcoal">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </FadeUp>
        <FadeUp delay={100}>
          <h2 className="text-2xl font-bold text-charcoal">Certifications &amp; Track Record</h2>
          <div className="mt-5 grid grid-cols-2 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border-grey bg-white p-5">
                <p className="text-2xl font-bold text-navy">{s.value}</p>
                <p className="mt-1 text-sm text-steel">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
