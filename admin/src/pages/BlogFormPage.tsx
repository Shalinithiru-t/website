import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  createBlog,
  emptyBlogInput,
  fetchAdminBlog,
  slugify,
  updateBlog,
  type BlogInput,
} from "@/lib/api"
import { FieldHint, SectionTitle, fieldClass, labelClass } from "@/components/FormField"
import { ImageUploadField } from "@/components/ImageUploadField"

export default function BlogFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState<BlogInput>(emptyBlogInput())
  const [contentText, setContentText] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (!token || !id) return
    fetchAdminBlog(token, id)
      .then((b) => {
        setForm({
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt,
          content: b.content,
          category: b.category,
          readTime: b.readTime,
          date: b.date,
          image: b.image,
          author: b.author,
          metaTitle: b.metaTitle,
          metaDescription: b.metaDescription,
          status: b.status,
          sortOrder: b.sortOrder,
        })
        setContentText(b.content.join("\n\n"))
        setSlugTouched(true)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [token, id])

  function setField<K extends keyof BlogInput>(key: K, value: BlogInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function onTitleChange(title: string) {
    setField("title", title)
    if (!slugTouched) setField("slug", slugify(title))
  }

  function buildPayload(): BlogInput {
    const content = contentText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)

    return {
      ...form,
      content: content.length ? content : ["Draft content"],
      metaTitle: form.metaTitle || form.title,
      metaDescription: form.metaDescription || form.excerpt,
      date:
        form.date ||
        new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setError("")
    try {
      const payload = buildPayload()
      if (isEdit && id) await updateBlog(token, id, payload)
      else await createBlog(token, payload)
      navigate("/blogs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-page text-steel">Loading blog…</div>

  return (
    <div className="admin-page">
      <Link to="/blogs" className="text-sm font-semibold text-accent hover:underline">
        ← Back to blogs
      </Link>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy">
        {isEdit ? "Edit blog" : "Add blog"}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-steel">
        Blogs appear under Resources on the website. Use the examples in each field as a guide.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="admin-form-grid mt-6">
        <section className="admin-card p-6 sm:p-7">
          <SectionTitle title="Article details" desc="Title, URL and category for the Resources list." />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <label className={labelClass} htmlFor="title">
                Title *
              </label>
              <input
                id="title"
                className={fieldClass}
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="e.g. How to Choose the Right PUF Panel Thickness"
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
                placeholder="e.g. choose-puf-panel-thickness"
                required
              />
              <FieldHint>
                Auto-filled from title. URL: /resources/<strong>your-slug</strong>
              </FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                className={fieldClass}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                <option value="Technical Guide">Technical Guide</option>
                <option value="Project Planning">Project Planning</option>
                <option value="Compliance">Compliance</option>
                <option value="Industry Insights">Industry Insights</option>
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
                onChange={(e) => setField("status", e.target.value as BlogInput["status"])}
              >
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (live)</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="readTime">
                Read time
              </label>
              <input
                id="readTime"
                className={fieldClass}
                value={form.readTime}
                onChange={(e) => setField("readTime", e.target.value)}
                placeholder="e.g. 6 min read"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="date">
                Display date
              </label>
              <input
                id="date"
                className={fieldClass}
                placeholder="e.g. March 2026"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
              />
              <FieldHint>Shown on the card — month and year is enough.</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="author">
                Author
              </label>
              <input
                id="author"
                className={fieldClass}
                value={form.author}
                onChange={(e) => setField("author", e.target.value)}
                placeholder="e.g. MountRoof Technical Team"
              />
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
            <div className="lg:col-span-2">
              <ImageUploadField
                id="image"
                label="Featured image"
                value={form.image}
                onChange={(url) => setField("image", url)}
                required
                hint="Upload a file or paste a URL for the resource card and article header."
              />
            </div>
          </div>
        </section>

        <section className="admin-card p-6 sm:p-7">
          <SectionTitle title="Content" desc="Excerpt for cards; full article below." />
          <div className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="excerpt">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                rows={2}
                className={fieldClass}
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
                placeholder="Short summary shown on the Resources listing card (1–2 sentences)."
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="content">
                Article content *
              </label>
              <textarea
                id="content"
                rows={12}
                className={fieldClass}
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder={
                  "Write paragraph one here.\n\nLeave a blank line between paragraphs.\n\nWrite paragraph two here."
                }
                required
              />
              <FieldHint>Separate paragraphs with a blank line. Each block becomes one paragraph on the site.</FieldHint>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Meta title (SEO)</label>
                <input
                  className={fieldClass}
                  value={form.metaTitle}
                  onChange={(e) => setField("metaTitle", e.target.value)}
                  placeholder="Optional — defaults to article title"
                />
              </div>
              <div>
                <label className={labelClass}>Meta description (SEO)</label>
                <input
                  className={fieldClass}
                  value={form.metaDescription}
                  onChange={(e) => setField("metaDescription", e.target.value)}
                  placeholder="Optional — defaults to excerpt"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create blog"}
          </button>
          <Link to="/blogs" className="admin-btn admin-btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
