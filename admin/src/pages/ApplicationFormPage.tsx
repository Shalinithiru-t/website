import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  createApplication,
  emptyApplicationInput,
  fetchAdminApplication,
  slugify,
  updateApplication,
  type ApplicationInput,
} from "@/lib/api"
import { FieldHint, SectionTitle, fieldClass, labelClass } from "@/components/FormField"
import { ImageUploadField } from "@/components/ImageUploadField"

function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function ApplicationFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState<ApplicationInput>(emptyApplicationInput())
  const [requirementsText, setRequirementsText] = useState("")
  const [productsText, setProductsText] = useState("")
  const [projectsText, setProjectsText] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (!token || !id) return
    fetchAdminApplication(token, id)
      .then((a) => {
        setForm({
          slug: a.slug,
          name: a.name,
          shortDescription: a.shortDescription,
          heroDescription: a.heroDescription,
          image: a.image,
          recommendedProductSlugs: a.recommendedProductSlugs,
          keyRequirements: a.keyRequirements,
          relatedProjectSlugs: a.relatedProjectSlugs,
          metaTitle: a.metaTitle,
          metaDescription: a.metaDescription,
          status: a.status,
          sortOrder: a.sortOrder,
        })
        setRequirementsText(a.keyRequirements.join("\n"))
        setProductsText(a.recommendedProductSlugs.join("\n"))
        setProjectsText(a.relatedProjectSlugs.join("\n"))
        setSlugTouched(true)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [token, id])

  function setField<K extends keyof ApplicationInput>(key: K, value: ApplicationInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setError("")
    try {
      const payload: ApplicationInput = {
        ...form,
        keyRequirements: linesToList(requirementsText),
        recommendedProductSlugs: linesToList(productsText),
        relatedProjectSlugs: linesToList(projectsText),
        metaTitle: form.metaTitle || form.name,
        metaDescription: form.metaDescription || form.shortDescription,
      }
      if (isEdit && id) await updateApplication(token, id, payload)
      else await createApplication(token, payload)
      navigate("/applications")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-page text-steel">Loading application…</div>

  return (
    <div className="admin-page">
      <Link to="/applications" className="text-sm font-bold text-accent hover:underline">
        ← Back to applications
      </Link>
      <h2 className="admin-page-title mt-2">
        {isEdit ? "Edit application" : "Add application"}
      </h2>
      <p className="admin-page-desc">
        Applications are industry pages (e.g. Cold Storage, Warehouses). Fill each field using the examples below.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="admin-form-grid mt-6">
        <section className="admin-card p-6 sm:p-7">
          <SectionTitle
            title="Basic details"
            desc="Name and URL used on the public Applications page."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <label className={labelClass} htmlFor="name">
                Name *
              </label>
              <input
                id="name"
                className={fieldClass}
                value={form.name}
                onChange={(e) => {
                  setField("name", e.target.value)
                  if (!slugTouched) setField("slug", slugify(e.target.value))
                }}
                placeholder="e.g. Cold Storage"
                required
              />
              <FieldHint>Industry / environment title shown on cards and page headings.</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className={fieldClass}
                value={form.status}
                onChange={(e) => setField("status", e.target.value as ApplicationInput["status"])}
              >
                <option value="draft">Draft (hidden on website)</option>
                <option value="published">Published (live on website)</option>
              </select>
              <FieldHint>Only Published items appear on the public site.</FieldHint>
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
                placeholder="e.g. cold-storage"
                required
              />
              <FieldHint>
                Auto-filled from name. Used in URL: /applications/<strong>cold-storage</strong>
              </FieldHint>
            </div>
            <div className="lg:col-span-3">
              <ImageUploadField
                id="image"
                label="Image"
                value={form.image}
                onChange={(url) => setField("image", url)}
                required
                hint="Upload a file or paste a full image link. Used as the card and hero photo."
              />
            </div>
          </div>
        </section>

        <section className="admin-card p-6 sm:p-7">
          <SectionTitle title="Descriptions" desc="Short text for cards; longer text for the detail page hero." />
          <div className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="shortDescription">
                Short description *
              </label>
              <textarea
                id="shortDescription"
                rows={2}
                className={fieldClass}
                value={form.shortDescription}
                onChange={(e) => setField("shortDescription", e.target.value)}
                placeholder="e.g. Temperature-engineered PUF panels for chilled and frozen storage facilities."
                required
              />
              <FieldHint>1–2 lines for listing cards. Keep it brief.</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="heroDescription">
                Hero description *
              </label>
              <textarea
                id="heroDescription"
                rows={4}
                className={fieldClass}
                value={form.heroDescription}
                onChange={(e) => setField("heroDescription", e.target.value)}
                placeholder="e.g. From chilled distribution hubs to sub-zero blast freezing rooms, MountRoof Cold Room Panels are specified against your exact temperature and load requirements…"
                required
              />
              <FieldHint>Longer paragraph shown at the top of the application detail page.</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="requirements">
                Key requirements (one per line)
              </label>
              <textarea
                id="requirements"
                className={fieldClass}
                rows={5}
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                placeholder={"Core thickness engineered for target temperature\nVapour-sealed condensation-resistant joints\nHygienic easy-to-clean finishes"}
              />
              <FieldHint>Each line becomes a bullet on the detail page. Press Enter for a new line.</FieldHint>
            </div>
          </div>
        </section>

        <section className="admin-card p-6 sm:p-7">
          <SectionTitle
            title="Related content"
            desc="Link existing products/projects by their slug (the URL part)."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="products">
                Recommended product slugs
              </label>
              <textarea
                id="products"
                className={fieldClass}
                rows={4}
                value={productsText}
                onChange={(e) => setProductsText(e.target.value)}
                placeholder={"cold-room-panels\nwall-puf-panels"}
              />
              <FieldHint>One product slug per line. Example: roof-puf-panels</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="projects">
                Related project slugs
              </label>
              <textarea
                id="projects"
                className={fieldClass}
                rows={4}
                value={projectsText}
                onChange={(e) => setProjectsText(e.target.value)}
                placeholder={"hyderabad-cold-chain-hub\nnashik-frozen-foods-facility"}
              />
              <FieldHint>One project slug per line from the Projects list.</FieldHint>
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
              <FieldHint>Lower numbers appear first (0, 1, 2…).</FieldHint>
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create application"}
          </button>
          <Link to="/applications" className="admin-btn admin-btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
