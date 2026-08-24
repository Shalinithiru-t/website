import { useEffect, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Breadcrumb from "@/components/shared/Breadcrumb"
import FadeUp from "@/components/shared/FadeUp"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { fetchResourceBySlug } from "@/lib/blogsApi"
import type { Resource } from "@/types"

export default function ResourceDetail() {
  const { slug } = useParams()
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    fetchResourceBySlug(slug || "").then((r) => {
      if (cancelled) return
      if (!r) {
        setNotFound(true)
        setResource(null)
      } else {
        setResource(r)
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  useDocumentMeta(
    resource ? resource.title : "Resource Not Found",
    resource ? resource.excerpt : "The requested resource could not be found."
  )

  if (loading) {
    return (
      <div className="container-1280 px-4 py-24 text-center text-steel sm:px-6 lg:px-10">
        Loading article…
      </div>
    )
  }

  if (notFound || !resource) return <Navigate to="/resources" replace />

  return (
    <div>
      <div className="bg-navy py-16 text-white">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <Breadcrumb
            items={[{ label: "Resources", to: "/resources" }, { label: resource.title }]}
            dark
          />
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="rounded-full bg-white/10 px-2.5 py-1 font-medium text-white">{resource.category}</span>
            <span>{resource.readTime}</span>
            <span>{resource.date}</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold sm:text-4xl">{resource.title}</h1>
          <p className="mt-3 max-w-2xl text-white/75">{resource.excerpt}</p>
        </div>
      </div>

      <article className="container-1280 px-4 py-16 sm:px-6 lg:px-10">
        <FadeUp className="mx-auto max-w-3xl">
          <div className="mb-10 overflow-hidden rounded-2xl">
            <img src={resource.image} alt={resource.title} className="aspect-[16/9] w-full object-cover" />
          </div>
          <div className="space-y-5 text-base leading-relaxed text-steel">
            {resource.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-border-grey pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Button asChild variant="outline">
              <Link to="/resources">
                <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
                All resources
              </Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-[#D94716]">
              <Link to="/enquire">Talk to our technical team</Link>
            </Button>
          </div>
        </FadeUp>
      </article>
    </div>
  )
}
