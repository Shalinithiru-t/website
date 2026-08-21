import { useMemo, useState } from "react"
import Breadcrumb from "@/components/shared/Breadcrumb"
import ProjectCard from "@/components/shared/ProjectCard"
import FadeUp from "@/components/shared/FadeUp"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { projects } from "@/data/projects"

const filters = ["All", "Warehouses", "Cold Storage", "Food Processing", "Pharma", "Industrial Facilities"]

export default function Projects() {
  useDocumentMeta(
    "Projects",
    "Explore MountRoof's completed industrial construction projects across warehouses, cold storage, food processing and pharma facilities in India."
  )
  const [filter, setFilter] = useState("All")

  const filtered = useMemo(
    () => projects.filter((p) => filter === "All" || p.applicationFilter === filter),
    [filter]
  )

  return (
    <div>
      <div className="bg-navy py-16 text-white">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <Breadcrumb items={[{ label: "Projects" }]} dark />
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Our Project Portfolio</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            A selection of MountRoof installations across India's warehousing, cold storage, food processing, pharma and industrial sectors.
          </p>
        </div>
      </div>

      <div className="container-1280 px-4 py-16 sm:px-6 lg:px-10">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === f ? "border-accent bg-accent text-white" : "border-border-grey bg-white text-charcoal hover:border-navy"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 60}>
              <ProjectCard project={p} />
            </FadeUp>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-10 text-center text-steel">No projects match this filter yet.</p>
        )}
      </div>
    </div>
  )
}
