import { useEffect, useState } from "react"
import { useParams, Link, Navigate } from "react-router-dom"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Breadcrumb from "@/components/shared/Breadcrumb"
import FadeUp from "@/components/shared/FadeUp"
import ProjectCard from "@/components/shared/ProjectCard"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { fetchApplicationBySlug } from "@/lib/applicationsApi"
import { fetchProducts } from "@/lib/productsApi"
import { fetchProjects } from "@/lib/projectsApi"
import type { Application, Product, Project } from "@/types"

export default function ApplicationDetail() {
  const { slug } = useParams()
  const [application, setApplication] = useState<Application | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    Promise.all([fetchApplicationBySlug(slug || ""), fetchProducts(), fetchProjects()]).then(
      ([app, productList, projectList]) => {
        if (cancelled) return
        if (!app) {
          setNotFound(true)
          setApplication(null)
        } else {
          setApplication(app)
          setProducts(productList)
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
    application ? application.name : "Application Not Found",
    application ? application.shortDescription : "The requested application could not be found."
  )

  if (loading) {
    return (
      <div className="container-1280 px-4 py-24 text-center text-steel sm:px-6 lg:px-10">
        Loading application…
      </div>
    )
  }

  if (notFound || !application) return <Navigate to="/applications" replace />

  const recommendedProducts = application.recommendedProductSlugs
    .map((s) => products.find((p) => p.slug === s))
    .filter(Boolean) as Product[]
  const relatedProjects = application.relatedProjectSlugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter(Boolean) as Project[]

  return (
    <div>
      <div className="relative overflow-hidden bg-navy py-20 text-white">
        <img src={application.image} alt={`${application.name} facility`} className="absolute inset-0 size-full object-cover opacity-30" />
        <div className="container-1280 relative px-4 sm:px-6 lg:px-10">
          <Breadcrumb items={[{ label: "Applications", to: "/applications" }, { label: application.name }]} dark />
          <h1 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">{application.name}</h1>
          <p className="mt-3 max-w-2xl text-white/75">{application.heroDescription}</p>
        </div>
      </div>

      <div className="container-1280 px-4 py-16 sm:px-6 lg:px-10">
        <FadeUp>
          <h2 className="text-2xl font-semibold text-charcoal">Key Requirements</h2>
          <ul className="mt-6 space-y-3">
            {application.keyRequirements.map((req) => (
              <li key={req} className="flex gap-3 text-steel">
                <Check className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </FadeUp>

        {recommendedProducts.length > 0 && (
          <FadeUp className="mt-16">
            <h2 className="text-2xl font-semibold text-charcoal">Recommended Products</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {recommendedProducts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/products/${p.slug}`}
                  className="flex items-center justify-between rounded-xl border border-border-grey bg-white p-4 hover:border-navy"
                >
                  <div>
                    <p className="font-semibold text-charcoal">{p.shortName}</p>
                    <p className="mt-1 text-sm text-steel">{p.shortDescription}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-accent" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </FadeUp>
        )}

        {relatedProjects.length > 0 && (
          <FadeUp className="mt-16">
            <h2 className="text-2xl font-semibold text-charcoal">Related Projects</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </FadeUp>
        )}

        <FadeUp className="mt-16 rounded-2xl bg-navy p-8 text-center text-white">
          <h2 className="text-xl font-semibold">Planning a {application.name.toLowerCase()} project?</h2>
          <p className="mt-2 text-white/75">Our technical team can help specify the right panel system for your facility.</p>
          <Button asChild className="mt-6 bg-accent hover:bg-[#D94716]">
            <Link to="/enquire">Get a Project Quote</Link>
          </Button>
        </FadeUp>
      </div>
    </div>
  )
}
