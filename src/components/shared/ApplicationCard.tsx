import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import type { Application } from "@/types"

export default function ApplicationCard({ application }: { application: Application }) {
  return (
    <Link
      to={`/applications/${application.slug}`}
      className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl"
    >
      <img
        src={application.image}
        alt={`${application.name} facility`}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" aria-hidden="true" />
      <div className="relative z-10 p-5">
        <h3 className="text-lg font-semibold text-white">{application.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/75">{application.shortDescription}</p>
        <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-white">
          Explore Solutions <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
