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

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border-grey px-3 py-2 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/15"
const labelClass = "block text-sm font-medium text-charcoal"

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
      if (isEdit && id) {
        await updateBlog(token, id, payload)
      } else {
        await createBlog(token, payload)
      }
      navigate("/blogs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-steel">Loading blog…</div>
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link to="/blogs" className="text-sm text-accent hover:underline">
          ← Back to blogs
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-navy">{isEdit ? "Edit blog" : "Add blog"}</h1>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
        <section className="rounded-2xl border border-border-grey bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="title">
                Title *
              </label>
              <input
                id="title"
                className={fieldClass}
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
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
                <option value="draft">Draft</option>
                <option value="published">Published</option>
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
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="date">
                Display date
              </label>
              <input
                id="date"
                className={fieldClass}
                placeholder="March 2026"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
              />
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
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="image">
                Featured image URL *
              </label>
              <input
                id="image"
                className={fieldClass}
                value={form.image}
                onChange={(e) => setField("image", e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="excerpt">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                rows={2}
                className={fieldClass}
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="content">
                Content * (separate paragraphs with a blank line)
              </label>
              <textarea
                id="content"
                rows={12}
                className={fieldClass}
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                required
              />
            </div>
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
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create blog"}
          </button>
          <Link to="/blogs" className="rounded-lg border border-border-grey px-5 py-2.5 text-sm font-medium hover:bg-surface">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
