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
import { FieldHint, SectionTitle, fieldClass, labelClass } from "@/components/FormField"
import { ImageUploadField } from "@/components/ImageUploadField"

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
    return <div className="admin-page text-steel">Loading product…</div>
  }

  return (
    <div className="admin-page">
      <Link to="/products" className="text-sm font-semibold text-accent hover:underline">
        ← Back to products
      </Link>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
        {isEdit ? "Edit product" : "Add product"}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-steel">
        Each field has an example below. Multi-line fields: one item per line unless the format says otherwise.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="admin-form-grid mt-6">
        <section className="admin-card p-6 sm:p-7">
          <SectionTitle title="Basic details" desc="Name, URL and category for the product page." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass} htmlFor="name">
                Full product name *
              </label>
              <input
                id="name"
                className={fieldClass}
                value={form.name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="e.g. Roof PUF Sandwich Panels"
                required
              />
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
                placeholder="e.g. roof-puf-panels"
                required
              />
              <FieldHint>
                Auto-filled from name. URL: /products/<strong>roof-puf-panels</strong>
              </FieldHint>
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
                placeholder="e.g. Roof PUF Panels"
                required
              />
              <FieldHint>Shorter label for cards and sticky nav.</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="category">
                Category label *
              </label>
              <input
                id="category"
                className={fieldClass}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                placeholder="e.g. Insulated Roofing"
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
              <FieldHint>Used by the filter chips on the Products list page.</FieldHint>
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
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (live)</option>
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
                placeholder="0"
              />
              <FieldHint>Lower numbers appear first.</FieldHint>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass} htmlFor="shortDescription">
                Short description *
              </label>
              <textarea
                id="shortDescription"
                rows={2}
                className={fieldClass}
                value={form.shortDescription}
                onChange={(e) => setField("shortDescription", e.target.value)}
                placeholder="1–2 lines for product cards."
                required
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass} htmlFor="heroDescription">
                Hero description *
              </label>
              <textarea
                id="heroDescription"
                rows={4}
                className={fieldClass}
                value={form.heroDescription}
                onChange={(e) => setField("heroDescription", e.target.value)}
                placeholder="Longer paragraph for the product detail hero section."
                required
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass} htmlFor="datasheetUrl">
                Datasheet URL
              </label>
              <input
                id="datasheetUrl"
                className={fieldClass}
                value={form.datasheetUrl}
                onChange={(e) => setField("datasheetUrl", e.target.value)}
                placeholder="https://…/datasheet.pdf (optional)"
              />
            </div>
          </div>
        </section>

        <section className="admin-card p-6 sm:p-7">
          <SectionTitle
            title="Media & options"
            desc="One item per line. Follow the format shown in each placeholder."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ImageUploadField
                id="add-product-image"
                label="Upload product image"
                value=""
                uploadOnly
                onChange={(url) => {
                  setImagesText((prev) => {
                    const line = `${url}|Product image`
                    return prev.trim() ? `${prev.trim()}\n${line}` : line
                  })
                }}
                hint="Each upload adds a line below. Edit the text after | for alt text."
              />
              <label className={`${labelClass} mt-4`}>Images list (url|alt text)</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={imagesText}
                onChange={(e) => setImagesText(e.target.value)}
                placeholder={"https://images.unsplash.com/photo-….jpg|Roof panel exterior\nhttps://….jpg|Detail joint close-up"}
              />
              <FieldHint>Format: imageURL|short alt text — one image per line. First image is the main card photo.</FieldHint>
            </div>
            <div>
              <label className={labelClass}>Colours (name|hex)</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={coloursText}
                onChange={(e) => setColoursText(e.target.value)}
                placeholder={"Off White|#F1EFE9\nSky Blue|#7FB3D5"}
              />
              <FieldHint>Format: Colour name|#HEXCODE</FieldHint>
            </div>
            <div>
              <label className={labelClass}>Thickness options</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={thicknessText}
                onChange={(e) => setThicknessText(e.target.value)}
                placeholder={"50mm\n80mm\n100mm"}
              />
              <FieldHint>One thickness per line for the configurator.</FieldHint>
            </div>
            <div>
              <label className={labelClass}>Surface materials</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={surfaceText}
                onChange={(e) => setSurfaceText(e.target.value)}
                placeholder={"PPGI\nPPGL\nStainless Steel"}
              />
            </div>
            <div>
              <label className={labelClass}>Application tags</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder={"Warehouses\nCold Storage\nIndustrial"}
              />
              <FieldHint>One tag per line — matches application names where possible.</FieldHint>
            </div>
            <div>
              <label className={labelClass}>Related product slugs</label>
              <textarea
                className={fieldClass}
                rows={3}
                value={relatedText}
                onChange={(e) => setRelatedText(e.target.value)}
                placeholder={"wall-puf-panels\ncold-room-panels"}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Trust points</label>
              <textarea
                className={fieldClass}
                rows={3}
                value={trustText}
                onChange={(e) => setTrustText(e.target.value)}
                placeholder={"ISO-certified manufacturing\nPan-India delivery support"}
              />
              <FieldHint>One trust line per line (shown near the product CTA).</FieldHint>
            </div>
          </div>
        </section>

        <section className="admin-card p-6 sm:p-7">
          <SectionTitle title="Specs, benefits & FAQ" desc="Use the pipe | character to separate parts." />
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Specifications (Key: Value)</label>
              <textarea
                className={fieldClass}
                rows={6}
                value={specsText}
                onChange={(e) => setSpecsText(e.target.value)}
                placeholder={"Panel Width: 1000mm\nCore Density: 40±2 kg/m³\nFacing: PPGI"}
              />
              <FieldHint>One spec per line as Label: Value</FieldHint>
            </div>
            <div>
              <label className={labelClass}>Benefits (title|description|icon)</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                placeholder={"Thermal Efficiency|Cuts cooling loads significantly|ShieldCheck"}
              />
              <FieldHint>Icon names: ShieldCheck, Thermometer, Ruler, Timer, Layers, Snowflake, etc.</FieldHint>
            </div>
            <div>
              <label className={labelClass}>FAQ (question|answer)</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={faqText}
                onChange={(e) => setFaqText(e.target.value)}
                placeholder={"What thicknesses are available?|We supply 50mm to 150mm as standard."}
              />
            </div>
          </div>
        </section>

        <section className="admin-card p-6 sm:p-7">
          <SectionTitle title="SEO" desc="Optional — defaults to product name / short description." />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Meta title</label>
              <input
                className={fieldClass}
                value={form.metaTitle}
                onChange={(e) => setField("metaTitle", e.target.value)}
                placeholder="Optional browser / SEO title"
              />
            </div>
            <div>
              <label className={labelClass}>Meta description</label>
              <input
                className={fieldClass}
                value={form.metaDescription}
                onChange={(e) => setField("metaDescription", e.target.value)}
                placeholder="Optional SEO description"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
          <Link to="/products" className="admin-btn admin-btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
