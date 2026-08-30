import { useEffect, useState, type MouseEvent } from "react"
import { useParams, Link, Navigate } from "react-router-dom"
import {
  Check,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  ClipboardList,
  SlidersHorizontal,
  Building2,
  Briefcase,
  HelpCircle,
  MapPin,
  Thermometer,
  Ruler,
  Timer,
  CloudRain,
  Layers,
  ShieldCheck,
  Settings2,
  Snowflake,
  Droplets,
  Sparkles,
  EyeOff,
  Sun,
  MoveHorizontal,
  Flame,
  Plus,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Breadcrumb from "@/components/shared/Breadcrumb"
import FadeUp from "@/components/shared/FadeUp"
import JsonLd from "@/components/shared/JsonLd"
import ProductCard from "@/components/shared/ProductCard"
import ProjectCard from "@/components/shared/ProjectCard"
import EnquiryDialog from "@/components/shared/EnquiryDialog"
import Configurator from "@/components/product/Configurator"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { fetchProductBySlug, fetchProducts } from "@/lib/productsApi"
import { fetchProjects } from "@/lib/projectsApi"
import { buildWhatsAppUrl, logAndBuildWhatsAppUrl, productWhatsAppMessage } from "@/lib/whatsapp"
import type { Product, Project } from "@/types"
import { applications } from "@/data/applications"

const iconMap = {
  Thermometer,
  Ruler,
  Timer,
  CloudRain,
  Layers,
  ShieldCheck,
  Settings2,
  Snowflake,
  Droplets,
  Sparkles,
  EyeOff,
  Sun,
  MoveHorizontal,
  Flame,
}

const anchors = [
  { id: "overview", label: "Overview", icon: Eye },
  { id: "specifications", label: "Specifications", icon: ClipboardList },
  { id: "configure", label: "Configure", icon: SlidersHorizontal },
  { id: "applications", label: "Applications", icon: Building2 },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
]

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setActiveImage(0)

    Promise.all([fetchProductBySlug(slug || ""), fetchProducts(), fetchProjects()]).then(
      ([p, list, projectList]) => {
        if (cancelled) return
        if (!p) {
          setNotFound(true)
          setProduct(null)
        } else {
          setProduct(p)
          setAllProducts(list)
          setProjects(projectList)
        }
        setLoading(false)
      }
    )

    return () => {
      cancelled = true
    }
  }, [slug])

  useDocumentMeta(
    product ? product.name : "Product Not Found",
    product ? product.shortDescription : "The requested product could not be found."
  )

  if (loading) {
    return (
      <div className="container-1280 px-4 py-24 text-center text-steel sm:px-6 lg:px-10">
        Loading product…
      </div>
    )
  }

  if (notFound || !product) return <Navigate to="/products" replace />

  const currentProduct = product
  const relatedProducts = currentProduct.relatedProductSlugs
    .map((s) => allProducts.find((p) => p.slug === s))
    .filter(Boolean) as Product[]
  const relatedProjects = projects.filter((p) => currentProduct.applicationTags.some((tag) => p.application.includes(tag.split(" ")[0]))).slice(0, 3)
  const galleryProjects = relatedProjects.length > 0 ? relatedProjects : projects.slice(0, 3)
  const relatedApplications = applications.filter((a) => currentProduct.applicationTags.includes(a.name)).slice(0, 4)
  const gallery = currentProduct.images.length > 0 ? [...currentProduct.images, ...currentProduct.images].slice(0, 6) : currentProduct.images
  const productUrl = typeof window !== "undefined" ? window.location.href : `https://www.mountroof.com/products/${currentProduct.slug}`
  const bookNowMessage = productWhatsAppMessage(currentProduct.name, productUrl)
  const bookNowHref = buildWhatsAppUrl(bookNowMessage)

  async function openProductWhatsApp(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    const href = await logAndBuildWhatsAppUrl(
      {
        source: "product",
        product: currentProduct.name,
        productSlug: currentProduct.slug,
        productUrl,
        message: bookNowMessage,
      },
      bookNowMessage
    )
    window.open(href, "_blank", "noopener,noreferrer")
  }

  function nextImage() {
    setActiveImage((i) => (i + 1) % gallery.length)
  }
  function prevImage() {
    setActiveImage((i) => (i - 1 + gallery.length) % gallery.length)
  }

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.heroDescription,
          image: product.images.map((i) => i.url),
          category: product.category,
          brand: { "@type": "Brand", name: "MountRoof" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Products", item: "/products" },
            { "@type": "ListItem", position: 2, name: product.category, item: "/products" },
            { "@type": "ListItem", position: 3, name: product.name, item: `/products/${product.slug}` },
          ],
        }}
      />
      {product.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: product.faq.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }}
        />
      )}

      {/* Breadcrumb */}
      <div className="border-b border-border-grey bg-white py-4">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <Breadcrumb items={[{ label: "Products", to: "/products" }, { label: product.category, to: "/products" }, { label: product.shortName }]} />
        </div>
      </div>

      {/* Hero */}
      <div className="container-1280 grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[55%_1fr] lg:px-10">
        <FadeUp>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
            <img src={gallery[activeImage].url} alt={gallery[activeImage].alt} className="size-full object-cover" />
            <span className="absolute bottom-3 left-3 rounded-full bg-navy/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {activeImage + 1} / {gallery.length}
            </span>
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-charcoal shadow-md hover:text-accent"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-charcoal shadow-md hover:text-accent"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {gallery.map((img, i) => (
              <button
                key={`${img.url}-${i}`}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}: ${img.alt}`}
                aria-pressed={activeImage === i}
                className={`size-16 shrink-0 overflow-hidden rounded-lg border-2 sm:size-20 ${activeImage === i ? "border-accent" : "border-border-grey"}`}
              >
                <img src={img.url} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">{product.category}</span>
          <h1 className="mt-2 text-3xl font-bold text-charcoal sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-steel">{product.heroDescription}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {product.trustPoints.slice(0, 4).map((t) => {
              const [label, ...rest] = t.split(" — ")
              return (
                <div key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{label}</p>
                    {rest.length > 0 && <p className="text-xs text-steel">{rest.join(" — ")}</p>}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="bg-[#25D366] text-white hover:bg-[#1ebe57]">
              <a href={bookNowHref} target="_blank" rel="noreferrer" onClick={(e) => void openProductWhatsApp(e)}>
                <MessageCircle className="mr-2 size-4" aria-hidden="true" />
                Book Now on WhatsApp
              </a>
            </Button>
            <Button onClick={() => setDialogOpen(true)} className="bg-accent hover:bg-[#D94716]">
              Request a Quote <ChevronRight className="ml-1 size-4" aria-hidden="true" />
            </Button>
            <Button onClick={() => setDialogOpen(true)} variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
              <Download className="mr-2 size-4" aria-hidden="true" /> Download Datasheet
            </Button>
          </div>
        </FadeUp>
      </div>

      {/* Anchor nav */}
      <div className="sticky top-[72px] z-30 border-y border-border-grey bg-white/95 backdrop-blur">
        <div className="container-1280 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <nav aria-label="Section navigation" className="flex flex-1 gap-6 overflow-x-auto py-3 text-sm font-medium text-steel">
            {anchors.map((a) => {
              const Icon = a.icon
              return (
                <a key={a.id} href={`#${a.id}`} className="flex shrink-0 items-center gap-1.5 border-b-2 border-transparent py-1 hover:text-accent has-[:hover]:text-accent [&.active]:border-accent [&.active]:text-accent">
                  <Icon className="size-4" aria-hidden="true" />
                  {a.label}
                </a>
              )
            })}
          </nav>
          <Button asChild size="sm" className="hidden shrink-0 bg-[#25D366] text-white hover:bg-[#1ebe57] sm:inline-flex">
            <a href={bookNowHref} target="_blank" rel="noreferrer" onClick={(e) => void openProductWhatsApp(e)}>
              <MessageCircle className="mr-1.5 size-4" aria-hidden="true" />
              Book Now
            </a>
          </Button>
          <Button onClick={() => setDialogOpen(true)} size="sm" className="hidden shrink-0 bg-accent hover:bg-[#D94716] sm:inline-flex">
            Request a Quote
          </Button>
        </div>
      </div>

      {/* Overview / Key Benefits */}
      <section id="overview" className="container-1280 scroll-mt-32 px-4 py-20 sm:px-6 lg:px-10">
        <FadeUp className="text-center">
          <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">Key Benefits</h2>
          <p className="mx-auto mt-3 max-w-2xl text-steel">{product.shortDescription}</p>
        </FadeUp>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {product.benefits.map((b, i) => {
            const Icon = iconMap[b.icon as keyof typeof iconMap] || ShieldCheck
            return (
              <FadeUp key={b.title} delay={i * 70} className="rounded-xl bg-surface p-6 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-accent shadow-sm">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold text-charcoal">{b.title}</h3>
                <p className="mt-1.5 text-sm text-steel">{b.description}</p>
              </FadeUp>
            )
          })}
        </div>
      </section>

      {/* Specifications */}
      <section id="specifications" className="scroll-mt-32 bg-surface py-20">
        <div className="container-1280 grid gap-8 px-4 sm:px-6 lg:grid-cols-[3fr_2fr] lg:px-10">
          <FadeUp className="overflow-hidden rounded-2xl border border-border-grey bg-white">
            <h2 className="border-b border-border-grey px-6 py-4 text-xl font-semibold text-charcoal">Specifications</h2>
            <table className="w-full text-left text-sm">
              <tbody>
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-surface/60"}>
                    <th scope="row" className="w-2/5 px-6 py-3.5 font-normal text-steel">{key}</th>
                    <td className="px-6 py-3.5 text-right font-semibold text-navy">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeUp>

          <FadeUp delay={80} className="overflow-hidden rounded-2xl border border-border-grey bg-white p-5">
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <img src={product.images[1]?.url || product.images[0].url} alt={product.images[1]?.alt || product.images[0].alt} className="size-full object-cover" />
            </div>
            <p className="mt-3 text-sm text-steel">{product.name} installed and finished on an industrial roof / wall envelope.</p>
            {product.statTiles && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {product.statTiles.map((s) => {
                  const Icon = iconMap[s.icon as keyof typeof iconMap] || Ruler
                  return (
                    <div key={s.label} className="rounded-lg bg-surface p-3">
                      <Icon className="size-4 text-accent" aria-hidden="true" />
                      <p className="mt-2 text-sm font-bold text-charcoal">{s.value}</p>
                      <p className="text-xs text-steel">{s.label}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </FadeUp>
        </div>
      </section>

      {/* Configure Your Requirement + Applications */}
      <section id="configure" className="container-1280 scroll-mt-32 px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start">
          <FadeUp>
            <Configurator product={product} />
          </FadeUp>

          <FadeUp delay={100} className="rounded-2xl border border-border-grey bg-white p-6" as="div">
            <div id="applications" className="scroll-mt-32">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-charcoal">Applications</h3>
                <Link to="/applications" className="text-sm font-medium text-navy hover:text-accent">View all</Link>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {(relatedApplications.length > 0 ? relatedApplications : applications.slice(0, 4)).map((a) => (
                  <Link key={a.slug} to={`/applications/${a.slug}`} className="group overflow-hidden rounded-xl border border-border-grey hover:border-navy">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={a.image} alt={a.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-charcoal">{a.name}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-steel">{a.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Related Projects */}
      <section id="projects" className="scroll-mt-32 bg-surface py-20">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <FadeUp className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-charcoal">Related Projects</h3>
            <Link to="/projects" className="text-sm font-medium text-navy hover:text-accent">View all projects</Link>
          </FadeUp>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryProjects.map((p, i) => (
              <FadeUp key={p.slug} delay={i * 70}>
                <ProjectCard project={p} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="container-1280 scroll-mt-32 px-4 py-20 sm:px-6 lg:px-10">
        <FadeUp className="mx-auto max-w-3xl rounded-2xl border border-border-grey bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-charcoal">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="mt-4">
            {product.faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <Plus className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
                    {f.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button asChild variant="outline" className="mt-6 w-full border-navy text-navy hover:bg-navy hover:text-white">
            <Link to="/resources">View All FAQs</Link>
          </Button>
        </FadeUp>
      </section>

      {/* Related products */}
      <section className="bg-surface py-20">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <FadeUp>
            <h3 className="text-2xl font-bold text-charcoal">Related Products</h3>
          </FadeUp>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p, i) => (
              <FadeUp key={p.slug} delay={i * 70} className="relative">
                <span className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white ${p.categoryFilter === "Wall Systems" ? "bg-navy" : "bg-accent"}`}>
                  {p.category}
                </span>
                <ProductCard product={p} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-16 text-white">
        <div className="container-1280 flex flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-10 lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent">
              <MapPin className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-2xl font-bold">Ready to Specify {product.shortName}?</h3>
              <p className="mt-1 max-w-xl text-white/70">Get a tailored quote based on your exact thickness, colour and area requirements.</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-4">
            <Button asChild className="bg-[#25D366] text-white hover:bg-[#1ebe57]">
              <a href={bookNowHref} target="_blank" rel="noreferrer" onClick={(e) => void openProductWhatsApp(e)}>
                <MessageCircle className="mr-2 size-4" aria-hidden="true" />
                Book Now on WhatsApp
              </a>
            </Button>
            <Button onClick={() => setDialogOpen(true)} className="bg-accent hover:bg-[#D94716]">Request a Quote</Button>
            <Button asChild variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white hover:text-navy">
              <Link to="/contact">Talk to an Expert</Link>
            </Button>
          </div>
        </div>
      </section>

      <EnquiryDialog open={dialogOpen} onOpenChange={setDialogOpen} prefill={{ product: product.name }} />
    </div>
  )
}
