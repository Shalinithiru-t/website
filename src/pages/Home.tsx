import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { ArrowRight, ShieldCheck, Truck, Award, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import SectionHeading from "@/components/shared/SectionHeading"
import ProductCard from "@/components/shared/ProductCard"
import ApplicationCard from "@/components/shared/ApplicationCard"
import ProjectCard from "@/components/shared/ProjectCard"
import FadeUp from "@/components/shared/FadeUp"
import JsonLd from "@/components/shared/JsonLd"
import EnquiryForm from "@/components/shared/EnquiryForm"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { fetchProducts } from "@/lib/productsApi"
import { fetchResources } from "@/lib/blogsApi"
import { fetchApplications } from "@/lib/applicationsApi"
import type { Product } from "@/types"
import type { Resource } from "@/types"
import type { Application } from "@/types"
import type { Project } from "@/types"
import { fetchProjects } from "@/lib/projectsApi"
import { stats } from "@/data/site"
import { useSiteInfo } from "@/context/SiteInfoContext"

const benefitIcons = { ShieldCheck, Truck, Award, Wrench }

const whyBenefits = [
  { title: "Thermal Efficiency", description: "High-density insulation cores that measurably cut cooling and heating loads.", icon: "ShieldCheck" },
  { title: "Faster Installation", description: "Single-fix panel systems that compress construction schedules significantly.", icon: "Wrench" },
  { title: "Custom Specifications", description: "Thickness, colour, surface and profile tailored to your exact project brief.", icon: "Award" },
  { title: "Technical Project Support", description: "Our engineers coordinate span, load and thermal design with your team.", icon: "Truck" },
]

export default function Home() {
  useDocumentMeta(
    "PUF Panels, Roofing & PEB Systems",
    "India's insulated building solutions partner. MountRoof supplies PUF sandwich panels, roofing, wall systems, cold-room panels and PEB structures nationwide."
  )
  const siteInfo = useSiteInfo()

  const [products, setProducts] = useState<Product[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchProducts(), fetchResources(), fetchApplications(), fetchProjects()]).then(
      ([productList, resourceList, applicationList, projectList]) => {
        if (!cancelled) {
          setProducts(productList)
          setResources(resourceList)
          setApplications(applicationList)
          setProjects(projectList)
        }
      }
    )
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteInfo.legalName,
          alternateName: siteInfo.brandName,
          url: "https://www.mountroof.com",
          telephone: siteInfo.phone,
          email: siteInfo.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
        }}
      />

      {/* A. Hero */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy text-white">
        <img
          src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2000&auto=format&fit=crop"
          alt="Large industrial warehouse with insulated metal roofing under construction"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/50" aria-hidden="true" />

        <div className="container-1440 relative z-10 grid gap-10 px-4 py-32 sm:px-6 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-7">
            <FadeUp>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                INDIA'S INSULATED BUILDING SOLUTIONS PARTNER
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                PUF Panels, Roofing &amp; PEB Systems Built for Industrial Performance.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/80">
                MountRoof engineers and manufactures insulated PUF sandwich panels, roofing systems, wall cladding, cold-room panels and PEB structures for warehouses, cold storage, food processing and industrial facilities across India.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-accent px-7 hover:bg-[#D94716]">
                  <Link to="/enquire">Get a Project Quote <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent px-7 text-white hover:bg-white hover:text-navy">
                  <Link to="/products">Explore Products</Link>
                </Button>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="mt-1 text-xs text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          <div className="hidden lg:col-span-5 lg:flex lg:items-center lg:justify-end">
            <FadeUp delay={150} className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">Engineered Envelope</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Roof PUF Sandwich Panels</h3>
              <p className="mt-2 text-sm text-white/70">
                Core thickness 20-200mm, effective width 1060mm, PPGI/PPGL surface finish. Engineered for long-span industrial roofs with single-fix installation.
              </p>
              <Link to="/products/roof-puf-panels" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-accent">
                View Specifications <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* B. Trust strip */}
      <section className="bg-navy py-10 text-white">
        <div className="container-1280 grid grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-10">
          {stats.map((s) => (
            <div key={s.label} className="border-l border-white/15 pl-4 first:border-l-0 first:pl-0 sm:first:border-l sm:first:pl-4">
              <p className="text-xl font-bold sm:text-2xl">{s.value}</p>
              <p className="mt-1 text-xs text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* C. Product category grid */}
      <section className="container-1280 px-4 py-28 sm:px-6 lg:px-10">
        <FadeUp>
          <SectionHeading eyebrow="Product Range" title="Explore Our Product Range" description="Five engineered panel systems covering roofing, wall envelopes, cold storage and architectural facades." />
        </FadeUp>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((p, i) => (
            <FadeUp key={p.slug} delay={i * 80}>
              <ProductCard product={p} />
            </FadeUp>
          ))}
        </div>
        {products.length > 6 && (
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
              <Link to="/products">Read More Products</Link>
            </Button>
          </div>
        )}
        {products.length > 0 && products.length <= 6 && (
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        )}
      </section>

      {/* D. Why MountRoof */}
      <section className="bg-surface py-28">
        <div className="container-1280 grid gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-10">
          <FadeUp>
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1400&auto=format&fit=crop"
              alt="Engineer reviewing industrial construction plans on site"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          </FadeUp>
          <FadeUp delay={100}>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Why MountRoof</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Engineered Panels Backed by Technical Expertise
            </h2>
            <p className="mt-4 text-steel">
              MountRoof panels are manufactured to consistent tolerances and backed by a technical team that works alongside your architects and structural engineers from specification through installation.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {whyBenefits.map((b) => {
                const Icon = benefitIcons[b.icon as keyof typeof benefitIcons]
                return (
                  <div key={b.title} className="rounded-xl border border-border-grey bg-white p-4">
                    <Icon className="size-6 text-accent" aria-hidden="true" />
                    <h3 className="mt-3 font-semibold text-charcoal">{b.title}</h3>
                    <p className="mt-1 text-sm text-steel">{b.description}</p>
                  </div>
                )
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* E. Applications */}
      <section className="container-1280 px-4 py-28 sm:px-6 lg:px-10">
        <FadeUp>
          <SectionHeading eyebrow="Applications" title="Solutions for Demanding Environments" description="From cold chains to cleanrooms, MountRoof panels are specified for environments where performance is non-negotiable." />
        </FadeUp>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.slice(0, 6).map((a, i) => (
            <FadeUp key={a.slug} delay={i * 80}>
              <ApplicationCard application={a} />
            </FadeUp>
          ))}
        </div>
        {applications.length > 0 && (
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
              <Link to="/applications">{applications.length > 6 ? "Read More Applications" : "View All Applications"}</Link>
            </Button>
          </div>
        )}
      </section>

      {/* F. Featured projects */}
      <section className="bg-surface py-28">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <FadeUp>
            <SectionHeading eyebrow="Project Portfolio" title="Built for Real-World Performance" description="A sample of MountRoof installations across warehousing, cold storage and industrial facilities." />
          </FadeUp>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => (
              <FadeUp key={p.slug} delay={i * 80}>
                <ProjectCard project={p} />
              </FadeUp>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* G. Technical guidance CTA */}
      <section className="bg-navy py-24 text-white">
        <div className="container-1280 flex flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-10">
          <FadeUp>
            <h2 className="text-3xl font-bold sm:text-4xl">Talk to a Technical Expert</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/75">
              Our engineers help you specify the right thickness, core material and surface finish for your project's exact thermal and structural requirements.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-[#D94716]">
                <Link to="/contact">Talk to a Technical Expert</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white hover:text-navy">
                <Link to="/contact">Download Product Brochure</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* H. Insights */}
      <section className="container-1280 px-4 py-28 sm:px-6 lg:px-10">
        <FadeUp>
          <SectionHeading eyebrow="Insights" title="Technical Resources & Guides" description="Practical guidance for specifying and planning insulated building envelopes." />
        </FadeUp>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.slice(0, 6).map((r, i) => (
            <FadeUp key={r.slug} delay={i * 80}>
              <Link to={`/resources/${r.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-grey bg-white transition hover:shadow-lg">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={r.image} alt={r.title} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">{r.category}</span>
                  <h3 className="mt-1.5 font-semibold text-charcoal">{r.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-steel">{r.excerpt}</p>
                  <span className="mt-3 text-xs text-steel">{r.readTime}</span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
        {resources.length > 0 && (
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
              <Link to="/resources">{resources.length > 6 ? "Read More Guides" : "View All Resources"}</Link>
            </Button>
          </div>
        )}
      </section>

      {/* I. Final lead section */}
      <section className="bg-surface py-28">
        <div className="container-1280 grid gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-10">
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Get Started</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">Ready to Start Your Project?</h2>
            <p className="mt-3 max-w-md text-steel">
              Share a few details about your project and our technical sales team will get back to you within one business day with a tailored quote.
            </p>
          </FadeUp>
          <FadeUp delay={100} className="rounded-2xl border border-border-grey bg-white p-6 shadow-sm sm:p-8">
            <EnquiryForm compact />
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
