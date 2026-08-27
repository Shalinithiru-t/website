import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  createProject,
  emptyProjectInput,
  fetchAdminProject,
  slugify,
  updateProject,
  type ProjectInput,
} from "@/lib/api"
import { FieldHint, SectionTitle, fieldClass, labelClass } from "@/components/FormField"
import { ImageUploadField } from "@/components/ImageUploadField"

const FILTERS = ["Warehouses", "Cold Storage", "Food Processing", "Pharma", "Industrial Facilities"]

function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseMetrics(text: string): { label: string; value: string }[] {
  return linesToList(text).map((line) => {
    const [label, ...rest] = line.split("|")
    return { label: (label || "").trim(), value: rest.join("|").trim() }
  }).filter((m) => m.label && m.value)
}

function parseGallery(text: string): { url: string; alt: string }[] {
  return linesToList(text).map((line) => {
    const [url, ...rest] = line.split("|")
    return { url: (url || "").trim(), alt: rest.join("|").trim() }
  }).filter((g) => g.url)
}

export default function ProjectFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState<ProjectInput>(emptyProjectInput())
  const [productsText, setProductsText] = useState("")
  const [metricsText, setMetricsText] = useState("")
  const [galleryText, setGalleryText] = useState("")
  const [quoteText, setQuoteText] = useState("")
  const [quoteAuthor, setQuoteAuthor] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (!token || !id) return
    fetchAdminProject(token, id)
      .then((p) => {
        setForm({
          slug: p.slug,
          title: p.title,
          city: p.city,
          state: p.state,
          product: p.product,
          application: p.application,
          applicationFilter: p.applicationFilter,
          area: p.area,
          image: p.image,
          summary: p.summary,
          challenge: p.challenge,
          solution: p.solution,
          productsUsed: p.productsUsed,
          metrics: p.metrics,
          gallery: p.gallery,
          quote: p.quote,
          metaTitle: p.metaTitle,
          metaDescription: p.metaDescription,
          status: p.status,
          sortOrder: p.sortOrder,
        })
        setProductsText(p.productsUsed.join("\n"))
        setMetricsText(p.metrics.map((m) => `${m.label}|${m.value}`).join("\n"))
        setGalleryText(p.gallery.map((g) => `${g.url}|${g.alt}`).join("\n"))
        setQuoteText(p.quote?.text || "")
        setQuoteAuthor(p.quote?.author || "")
        setSlugTouched(true)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [token, id])

  function setField<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setError("")
    try {
      const payload: ProjectInput = {
        ...form,
        productsUsed: linesToList(productsText),
        metrics: parseMetrics(metricsText),
        gallery: parseGallery(galleryText),
        quote: quoteText.trim() || quoteAuthor.trim() ? { text: quoteText.trim(), author: quoteAuthor.trim() } : undefined,
        metaTitle: form.metaTitle || form.title,
        metaDescription: form.metaDescription || form.summary,
      }
      if (isEdit && id) await updateProject(token, id, payload)
      else await createProject(token, payload)
      navigate("/projects")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-page text-steel">Loading project…</div>

  return (
    <div className="admin-page">
      <Link to="/projects" className="text-sm font-bold text-accent hover:underline">
        ← Back to projects
      </Link>
      <h2 className="admin-page-title mt-2">{isEdit ? "Edit project" : "Add project"}</h2>
      <p className="admin-page-desc">
        Project case studies appear on /projects and related sections of the website.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="admin-form-grid mt-6">
        <section className="admin-card p-6 sm:p-7">
          <SectionTitle title="Basic details" desc="Title, location, and listing card fields." />
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <label className={labelClass} htmlFor="title">
                Title *
              </label>
              <input
                id="title"
                className={fieldClass}
                value={form.title}
                onChange={(e) => {
                  setField("title", e.target.value)
                  if (!slugTouched) setField("slug", slugify(e.target.value))
                }}
                placeholder="e.g. Bengaluru Logistics Park Roofing & PEB"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className={fieldClass}
                value={form.status}
                onChange={(e) => setField("status", e.target.value as ProjectInput["status"])}
              >
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (live)</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="slug">
                Slug * (URL)
              </label>
              <input
                id="slug"
                className={fieldClass}
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setField("slug", slugify(e.target.value))
                }}
                placeholder="e.g. bengaluru-logistics-park"
                required
              />
              <FieldHint>
                URL: /projects/<strong>your-slug</strong>
              </FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="city">
                City *
              </label>
              <input
                id="city"
                className={fieldClass}
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="e.g. Bengaluru"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="state">
                State *
              </label>
              <input
                id="state"
                className={fieldClass}
                value={form.state}
                onChange={(e) => setField("state", e.target.value)}
                placeholder="e.g. Karnataka"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="area">
                Area *
              </label>
              <input
                id="area"
                className={fieldClass}
                value={form.area}
                onChange={(e) => setField("area", e.target.value)}
                placeholder="e.g. 4,20,000 sq ft"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="applicationFilter">
                Filter category *
              </label>
              <select
                id="applicationFilter"
                className={fieldClass}
                value={form.applicationFilter}
                onChange={(e) => setField("applicationFilter", e.target.value)}
              >
                {FILTERS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <FieldHint>Used by filter chips on the Projects list page.</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="sortOrder">
                Sort order
              </label>
              <input
                id="sortOrder"
                type="number"
                className={fieldClass}
                value={form.sortOrder}
                onChange={(e) => setField("sortOrder", Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass} htmlFor="application">
                Application label *
              </label>
              <input
                id="application"
                className={fieldClass}
                value={form.application}
                onChange={(e) => setField("application", e.target.value)}
                placeholder="e.g. Warehouses & Logistics"
                required
              />
            </div>
            <div className="lg:col-span-3">
              <label className={labelClass} htmlFor="product">
                Products (short) *
              </label>
              <input
                id="product"
                className={fieldClass}
                value={form.product}
                onChange={(e) => setField("product", e.target.value)}
                placeholder="e.g. Roof PUF Panels, Wall PUF Panels"
                required
              />
              <FieldHint>Shown on the project card.</FieldHint>
            </div>
            <div className="lg:col-span-3">
              <ImageUploadField
                id="image"
                label="Hero / card image"
                value={form.image}
                onChange={(url) => setField("image", url)}
                required
                hint="Upload a file or paste an image URL."
              />
            </div>
          </div>
        </section>

        <section className="admin-card p-6 sm:p-7">
          <SectionTitle title="Story" desc="Overview, challenge, and solution for the detail page." />
          <div className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="summary">
                Summary *
              </label>
              <textarea
                id="summary"
                rows={2}
                className={fieldClass}
                value={form.summary}
                onChange={(e) => setField("summary", e.target.value)}
                placeholder="1–2 lines for cards and overview."
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="challenge">
                Challenge *
              </label>
              <textarea
                id="challenge"
                rows={4}
                className={fieldClass}
                value={form.challenge}
                onChange={(e) => setField("challenge", e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="solution">
                Solution *
              </label>
              <textarea
                id="solution"
                rows={4}
                className={fieldClass}
                value={form.solution}
                onChange={(e) => setField("solution", e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className="admin-card p-6 sm:p-7">
          <SectionTitle title="Details & gallery" desc="One item per line. Follow the formats in the placeholders." />
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Products used (one per line)</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={productsText}
                onChange={(e) => setProductsText(e.target.value)}
                placeholder={"Roof PUF Panels (60mm)\nWall PUF Panels (50mm)"}
              />
            </div>
            <div>
              <label className={labelClass}>Metrics (label|value)</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={metricsText}
                onChange={(e) => setMetricsText(e.target.value)}
                placeholder={"Roof Area Covered|4.2 lakh sq ft\nInstallation Timeline|18 weeks"}
              />
              <FieldHint>Format: Label|Value</FieldHint>
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Gallery (url|alt text)</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={galleryText}
                onChange={(e) => setGalleryText(e.target.value)}
                placeholder={"https://….jpg|Aerial view of warehouse roofs\nhttps://….jpg|Panel installation"}
              />
              <FieldHint>
                Paste URLs from Upload on the hero field, or external links. Format: imageURL|alt text
              </FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="quoteText">
                Quote (optional)
              </label>
              <textarea
                id="quoteText"
                rows={3}
                className={fieldClass}
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Client testimonial text…"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="quoteAuthor">
                Quote author
              </label>
              <input
                id="quoteAuthor"
                className={fieldClass}
                value={quoteAuthor}
                onChange={(e) => setQuoteAuthor(e.target.value)}
                placeholder="e.g. Project Director, Developer"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create project"}
          </button>
          <Link to="/projects" className="admin-btn admin-btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
