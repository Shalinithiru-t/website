import { useParams, Link, Navigate } from "react-router-dom"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Breadcrumb from "@/components/shared/Breadcrumb"
import FadeUp from "@/components/shared/FadeUp"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { getProjectBySlug } from "@/data/projects"

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug || "")

  useDocumentMeta(
    project ? project.title : "Project Not Found",
    project ? project.summary : "The requested project could not be found."
  )

  if (!project) return <Navigate to="/projects" replace />

  return (
    <div>
      <div className="relative flex min-h-[50vh] items-end overflow-hidden bg-navy text-white">
        <img src={project.image} alt={`${project.title} - hero image`} className="absolute inset-0 size-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" aria-hidden="true" />
        <div className="container-1280 relative px-4 py-14 sm:px-6 lg:px-10">
          <Breadcrumb items={[{ label: "Projects", to: "/projects" }, { label: project.title }]} dark />
          <h1 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">{project.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-white/80"><MapPin className="size-4" aria-hidden="true" />{project.city}, {project.state}</p>
        </div>
      </div>

      <div className="container-1280 grid gap-10 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-10">
        <div className="lg:col-span-2">
          <FadeUp>
            <h2 className="text-2xl font-bold text-charcoal">Overview</h2>
            <p className="mt-3 text-steel">{project.summary}</p>
          </FadeUp>
          <FadeUp delay={80} className="mt-8">
            <h2 className="text-2xl font-bold text-charcoal">The Challenge</h2>
            <p className="mt-3 text-steel">{project.challenge}</p>
          </FadeUp>
          <FadeUp delay={120} className="mt-8">
            <h2 className="text-2xl font-bold text-charcoal">The Solution</h2>
            <p className="mt-3 text-steel">{project.solution}</p>
          </FadeUp>

          <FadeUp delay={160} className="mt-10">
            <h2 className="text-2xl font-bold text-charcoal">Project Gallery</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {project.gallery.map((g) => (
                <img key={g.url} src={g.url} alt={g.alt} loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />
              ))}
            </div>
          </FadeUp>

          {project.quote && (
            <FadeUp delay={200} className="mt-10 rounded-2xl bg-surface p-8">
              <blockquote className="text-lg font-medium italic text-charcoal">&ldquo;{project.quote.text}&rdquo;</blockquote>
              <p className="mt-3 text-sm text-steel">&mdash; {project.quote.author}</p>
            </FadeUp>
          )}
        </div>

        <div className="space-y-6">
          <FadeUp className="rounded-2xl border border-border-grey bg-white p-6">
            <h3 className="font-semibold text-charcoal">Project Metrics</h3>
            <dl className="mt-4 space-y-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="flex items-center justify-between text-sm">
                  <dt className="text-steel">{m.label}</dt>
                  <dd className="font-semibold text-charcoal">{m.value}</dd>
                </div>
              ))}
            </dl>
          </FadeUp>
          <FadeUp delay={60} className="rounded-2xl border border-border-grey bg-white p-6">
            <h3 className="font-semibold text-charcoal">Products Used</h3>
            <ul className="mt-4 space-y-2 text-sm text-steel">
              {project.productsUsed.map((p) => (
                <li key={p} className="rounded-lg bg-surface px-3 py-2 text-charcoal">{p}</li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={100} className="rounded-2xl bg-navy p-6 text-white">
            <h3 className="font-semibold">Have a Similar Project?</h3>
            <p className="mt-2 text-sm text-white/75">Get a tailored quote based on your building specifications.</p>
            <Button asChild className="mt-4 w-full bg-accent hover:bg-[#D94716]">
              <Link to="/enquire">Get a Project Quote</Link>
            </Button>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
