import { Link } from "react-router-dom"
import { ArrowRight, MapPin } from "lucide-react"
import type { Project } from "@/types"

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border-grey bg-white transition hover:shadow-lg"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={project.image}
          alt={`${project.title} - completed MountRoof project`}
          loading="lazy"
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="flex items-center gap-1 text-xs font-medium text-steel"><MapPin className="size-3.5" aria-hidden="true" />{project.city}, {project.state}</span>
        <h3 className="mt-1.5 text-lg font-semibold text-charcoal">{project.title}</h3>
        <p className="mt-2 text-sm text-steel">{project.product} &middot; {project.area}</p>
        <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-accent">
          View Case Study <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
