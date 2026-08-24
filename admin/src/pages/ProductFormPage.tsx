import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  createProduct,
  emptyProductInput,
  fetchAdminProduct,
  slugify,
  updateProduct,
  type ProductInput,
} from "@/lib/api"

function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

function listToLines(list: string[]): string {
  return list.join("\n")
}

function specsToText(specs: Record<string, string>): string {
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n")
}

function textToSpecs(text: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const line of text.split("\n")) {
    const idx = line.indexOf(":")
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (key) out[key] = value
  }
  return out
}

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border-grey px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
const labelClass = "block text-sm font-medium text-charcoal"

export default function ProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState<ProductInput>(emptyProductInput())
  const [specsText, setSpecsText] = useState("Panel Width: ")
  const [thicknessText, setThicknessText] = useState("50mm\n80mm\n100mm")
  const [surfaceText, setSurfaceText] = useState("PPGI\nPPGL")
  const [tagsText, setTagsText] = useState("Warehouses")
  const [relatedText, setRelatedText] = useState("")
  const [trustText, setTrustText] = useState("")
  const [imagesText, setImagesText] = useState("")
  const [coloursText, setColoursText] = useState("Off White|#F1EFE9\nSky Blue|#7FB3D5")
  const [benefitsText, setBenefitsText] = useState("Title|Description|ShieldCheck")
  const [faqText, setFaqText] = useState("Question|Answer")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (!token || !id) return
    fetchAdminProduct(token, id)
      .then((p) => {
        setForm({
          slug: p.slug,
          name: p.name,
          shortName: p.shortName,
          category: p.category,
          categoryFilter: p.categoryFilter,
          shortDescription: p.shortDescription,
          heroDescription: p.heroDescription,
          images: p.images,
          benefits: p.benefits,
          specifications: p.specifications,
          thicknessOptions: p.thicknessOptions,
          colourOptions: p.colourOptions,
          surfaceMaterialOptions: p.surfaceMaterialOptions,
          applicationTags: p.applicationTags,
          faq: p.faq,
          relatedProductSlugs: p.relatedProductSlugs,
          datasheetUrl: p.datasheetUrl,
          trustPoints: p.trustPoints,
          statTiles: p.statTiles,
          metaTitle: p.metaTitle,
          metaDescription: p.metaDescription,
          status: p.status,
          sortOrder: p.sortOrder,
        })
        setSpecsText(specsToText(p.specifications))
        setThicknessText(listToLines(p.thicknessOptions))
        setSurfaceText(listToLines(p.surfaceMaterialOptions))
        setTagsText(listToLines(p.applicationTags))
        setRelatedText(listToLines(p.relatedProductSlugs))
        setTrustText(listToLines(p.trustPoints))
        setImagesText(p.images.map((img) => `${img.url}|${img.alt}`).join("\n"))
        setColoursText(p.colourOptions.map((c) => `${c.name}|${c.hex}`).join("\n"))
        setBenefitsText(p.benefits.map((b) => `${b.title}|${b.description}|${b.icon}`).join("\n"))
        setFaqText(p.faq.map((f) => `${f.question}|${f.answer}`).join("\n"))
        setSlugTouched(true)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [token, id])

  function setField<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function onNameChange(name: string) {
    setField("name", name)
    if (!slugTouched) setField("slug", slugify(name))
  }

  function buildPayload(): ProductInput {
    const images = imagesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [url, ...rest] = line.split("|")
        return { url: url.trim(), alt: rest.join("|").trim() }
      })

    const colourOptions = coloursText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, hex] = line.split("|")
        return { name: (name || "").trim(), hex: (hex || "#000000").trim() }
      })

    const benefits = benefitsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, description, icon] = line.split("|")
        return {
          title: (title || "").trim(),
          description: (description || "").trim(),
          icon: (icon || "ShieldCheck").trim(),
        }
      })
      .filter((b) => b.title && b.description)

    const faq = faqText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [question, ...rest] = line.split("|")
        return { question: (question || "").trim(), answer: rest.join("|").trim() }
      })
      .filter((f) => f.question && f.answer)

    return {
      ...form,
      images: images.length ? images : [{ url: "https://placehold.co/800x600", alt: form.name }],
      colourOptions,
      benefits,
      faq,
      specifications: textToSpecs(specsText),
      thicknessOptions: linesToList(thicknessText),
      surfaceMaterialOptions: linesToList(surfaceText),
      applicationTags: linesToList(tagsText),
      relatedProductSlugs: linesToList(relatedText),
      trustPoints: linesToList(trustText),
      metaTitle: form.metaTitle || form.name,
      metaDescription: form.metaDescription || form.shortDescription,
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setError("")
    try {
      const payload = buildPayload()
      if (isEdit && id) {
        await updateProduct(token, id, payload)
      } else {
        await createProduct(token, payload)
      }
      navigate("/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-steel">Loading product…</div>
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link to="/products" className="text-sm text-accent hover:underline">
          ← Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-navy">{isEdit ? "Edit product" : "Add product"}</h1>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-8">
        <section className="rounded-2xl border border-border-grey bg-white p-6">
          <h2 className="text-lg font-semibold text-navy">Basic</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="name">
                Name *
              </label>
              <input
                id="name"
                className={fieldClass}
                value={form.name}
                onChange={(e) => onNameChange(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="slug">
                Slug *
              </label>
              <input
                id="slug"
                className={fieldClass}
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setField("slug", slugify(e.target.value))
                }}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="shortName">
                Short name *
              </label>
              <input
                id="shortName"
                className={fieldClass}
                value={form.shortName}
                onChange={(e) => setField("shortName", e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="category">
                Category *
              </label>
              <input
                id="category"
                className={fieldClass}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="categoryFilter">
                Category filter *
              </label>
              <select
                id="categoryFilter"
                className={fieldClass}
                value={form.categoryFilter}
                onChange={(e) => setField("categoryFilter", e.target.value)}
              >
                <option value="Roofing">Roofing</option>
                <option value="Wall Systems">Wall Systems</option>
                <option value="Cold Storage">Cold Storage</option>
                <option value="Specialized">Specialized</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className={fieldClass}
                value={form.status}
                onChange={(e) => setField("status", e.target.value as ProductInput["status"])}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
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
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="shortDescription">
                Short description *
              </label>
              <textarea
                id="shortDescription"
                rows={2}
                className={fieldClass}
                value={form.shortDescription}
                onChange={(e) => setField("shortDescription", e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="heroDescription">
                Hero description *
              </label>
              <textarea
                id="heroDescription"
                rows={4}
                className={fieldClass}
                value={form.heroDescription}
                onChange={(e) => setField("heroDescription", e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="datasheetUrl">
                Datasheet URL
              </label>
              <input
                id="datasheetUrl"
                className={fieldClass}
                value={form.datasheetUrl}
                onChange={(e) => setField("datasheetUrl", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border-grey bg-white p-6">
          <h2 className="text-lg font-semibold text-navy">Media & options</h2>
          <p className="mt-1 text-xs text-steel">One item per line. Use <code>url|alt</code> for images, <code>name|hex</code> for colours.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Images (url|alt)</label>
              <textarea className={fieldClass} rows={4} value={imagesText} onChange={(e) => setImagesText(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Colours (name|hex)</label>
              <textarea className={fieldClass} rows={4} value={coloursText} onChange={(e) => setColoursText(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Thickness options</label>
              <textarea className={fieldClass} rows={4} value={thicknessText} onChange={(e) => setThicknessText(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Surface materials</label>
              <textarea className={fieldClass} rows={4} value={surfaceText} onChange={(e) => setSurfaceText(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Application tags</label>
              <textarea className={fieldClass} rows={4} value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Related product slugs</label>
              <textarea className={fieldClass} rows={3} value={relatedText} onChange={(e) => setRelatedText(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Trust points</label>
              <textarea className={fieldClass} rows={3} value={trustText} onChange={(e) => setTrustText(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border-grey bg-white p-6">
          <h2 className="text-lg font-semibold text-navy">Specs, benefits & FAQ</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className={labelClass}>Specifications (Key: Value)</label>
              <textarea className={fieldClass} rows={6} value={specsText} onChange={(e) => setSpecsText(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Benefits (title|description|icon)</label>
              <textarea className={fieldClass} rows={4} value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>FAQ (question|answer)</label>
              <textarea className={fieldClass} rows={4} value={faqText} onChange={(e) => setFaqText(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border-grey bg-white p-6">
          <h2 className="text-lg font-semibold text-navy">SEO</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Meta title</label>
              <input className={fieldClass} value={form.metaTitle} onChange={(e) => setField("metaTitle", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Meta description</label>
              <input
                className={fieldClass}
                value={form.metaDescription}
                onChange={(e) => setField("metaDescription", e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#D94716] disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
          <Link to="/products" className="rounded-lg border border-border-grey px-5 py-2.5 text-sm font-medium hover:bg-surface">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
