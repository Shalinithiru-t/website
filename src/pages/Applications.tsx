import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Breadcrumb from "@/components/shared/Breadcrumb"
import SectionHeading from "@/components/shared/SectionHeading"
import ApplicationCard from "@/components/shared/ApplicationCard"
import ProjectCard from "@/components/shared/ProjectCard"
import FadeUp from "@/components/shared/FadeUp"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { fetchApplications } from "@/lib/applicationsApi"
import { fetchProjects } from "@/lib/projectsApi"
import type { Application } from "@/types"
import type { Project } from "@/types"

export default function Applications() {
  useDocumentMeta(
    "Applications",
    "MountRoof insulated panel solutions for warehouses, cold storage, food processing, pharma cleanrooms and industrial facilities."
  )

  const [applications, setApplications] = useState<Application[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchApplications(), fetchProjects()]).then(([apps, projectList]) => {
      if (!cancelled) {
        setApplications(apps)
        setProjects(projectList)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const visible = showAll ? applications : applications.slice(0, 6)

  return (
    <div>
      <div className="relative overflow-hidden bg-navy py-20 text-white">
        <img
          src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=1800&auto=format&fit=crop"
          alt="Industrial facility exterior"
          className="absolute inset-0 size-full object-cover opacity-30"
        />
        <div className="container-1280 relative px-4 sm:px-6 lg:px-10">
          <Breadcrumb items={[{ label: "Applications" }]} dark />
          <h1 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">Solutions for Demanding Environments</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            From ambient warehousing to sub-zero cold chains, MountRoof panels are engineered and specified for the specific demands of each industrial environment.
          </p>
        </div>
      </div>

      <div className="container-1280 px-4 py-20 sm:px-6 lg:px-10">
        <SectionHeading eyebrow="By Environment" title="Choose Your Application" />
        {loading && <p className="mt-10 text-center text-steel">Loading applications…</p>}
        {!loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((a, i) => (
              <FadeUp key={a.slug} delay={i * 70}>
                <ApplicationCard application={a} />
              </FadeUp>
            ))}
          </div>
        )}
        {!loading && applications.length > 6 && !showAll && (
          <div className="mt-10 text-center">
            <Button
              type="button"
              variant="outline"
              className="border-navy text-navy hover:bg-navy hover:text-white"
              onClick={() => setShowAll(true)}
            >
              Read More
            </Button>
          </div>
        )}
      </div>

      <div className="bg-surface py-20">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <SectionHeading eyebrow="Portfolio" title="Recent Application Projects" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => (
              <FadeUp key={p.slug} delay={i * 70}>
                <ProjectCard project={p} />
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-navy py-20 text-white">
        <div className="container-1280 flex flex-col items-center gap-5 px-4 text-center sm:px-6 lg:px-10">
          <h2 className="text-3xl font-bold">Not Sure Which Application Fits Your Project?</h2>
          <Button asChild className="bg-accent hover:bg-[#D94716]">
            <Link to="/enquire">Talk to Our Technical Team</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
