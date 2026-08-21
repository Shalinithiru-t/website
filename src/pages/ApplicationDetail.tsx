import { useParams, Link, Navigate } from "react-router-dom"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Breadcrumb from "@/components/shared/Breadcrumb"
import FadeUp from "@/components/shared/FadeUp"
import ProductCard from "@/components/shared/ProductCard"
import ProjectCard from "@/components/shared/ProjectCard"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { getApplicationBySlug } from "@/data/applications"
import { products } from "@/data/products"
import { projects } from "@/data/projects"

export default function ApplicationDetail() {
  const { slug } = useParams()
  const application = getApplicationBySlug(slug || "")

  useDocumentMeta(
    application ? application.name : "Application Not Found",
    application ? application.shortDescription : "The requested application could not be found."
  )

  if (!application) return <Navigate to="/applications" replace />

  const recommendedProducts = application.recommendedProductSlugs
    .map((s) => products.find((p) => p.slug === s))
    .filter(Boolean) as typeof products
  const relatedProjects = application.relatedProjectSlugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter(Boolean) as typeof projects

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

      <div className="container-1280 grid gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-10">
        <FadeUp>
          <h2 className="text-2xl font-bold text-charcoal">Key Requirements</h2>
          <ul className="mt-5 space-y-3">
            {application.keyRequirements.map((r) => (
              <li key={r} className="flex items-start gap-2.5 text-charcoal">
                <Check className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        </FadeUp>
        <FadeUp delay={100}>
          <h2 className="text-2xl font-bold text-charcoal">Recommended Products</h2>
          <div className="mt-5 space-y-3">
            {recommendedProducts.map((p) => (
              <Link key={p.slug} to={`/products/${p.slug}`} className="flex items-center justify-between rounded-xl border border-border-grey bg-white p-4 hover:border-navy">
                <span className="font-medium text-charcoal">{p.shortName}</span>
                <ArrowRight className="size-4 text-steel" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </FadeUp>
      </div>

      {relatedProjects.length > 0 && (
        <div className="bg-surface py-20">
          <div className="container-1280 px-4 sm:px-6 lg:px-10">
            <h2 className="text-2xl font-bold text-charcoal">Related Projects</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p, i) => (
                <FadeUp key={p.slug} delay={i * 70}>
                  <ProjectCard project={p} />
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-navy py-20 text-white">
        <div className="container-1280 flex flex-col items-center gap-5 px-4 text-center sm:px-6 lg:px-10">
          <h2 className="text-3xl font-bold">Planning a {application.name} Project?</h2>
          <Button asChild className="bg-accent hover:bg-[#D94716]">
            <Link to="/enquire">Get a Project Quote</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
