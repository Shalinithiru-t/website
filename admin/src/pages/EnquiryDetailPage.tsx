import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Phone, Mail, MessageCircle, Trash2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import {
  deleteAdminEnquiry,
  fetchAdminEnquiry,
  updateAdminEnquiry,
  type AdminEnquiry,
  type EnquiryStatus,
} from "@/lib/api"

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="grid gap-1 border-b border-border-grey py-3 sm:grid-cols-3">
      <dt className="text-sm font-medium text-steel">{label}</dt>
      <dd className="text-sm text-charcoal sm:col-span-2">{value}</dd>
    </div>
  )
}

export default function EnquiryDetailPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const [enquiry, setEnquiry] = useState<AdminEnquiry | null>(null)
  const [status, setStatus] = useState<EnquiryStatus>("new")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !id) return
    fetchAdminEnquiry(token, id)
      .then((e) => {
        setEnquiry(e)
        setStatus(e.status)
        setNotes(e.notes)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false))
  }, [token, id])

  async function save() {
    if (!token || !id) return
    setSaving(true)
    setError("")
    try {
      const updated = await updateAdminEnquiry(token, id, { status, notes })
      setEnquiry(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!token || !id || !enquiry) return
    if (!confirm(`Delete enquiry ${enquiry.referenceId}?`)) return
    await deleteAdminEnquiry(token, id)
    window.location.href = "/enquiries"
  }

  if (loading) return <div className="p-8 text-steel">Loading enquiry…</div>
  if (!enquiry) return <div className="p-8 text-red-700">{error || "Enquiry not found"}</div>

  const whatsappText = encodeURIComponent(
    `Hello ${enquiry.name}, regarding your MountRoof enquiry ${enquiry.referenceId} for ${enquiry.product}.`
  )

  return (
    <div className="admin-page">
      <Link to="/enquiries" className="text-sm text-accent hover:underline">
        ← Back to enquiries
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">{enquiry.referenceId}</h1>
          <p className="mt-1 text-steel">
            {enquiry.name} · {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:+91${enquiry.phone}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border-grey px-3 py-2 text-sm hover:bg-surface"
          >
            <Phone className="size-4" aria-hidden="true" />
            Call
          </a>
          {enquiry.email && (
            <a
              href={`mailto:${enquiry.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border-grey px-3 py-2 text-sm hover:bg-surface"
            >
              <Mail className="size-4" aria-hidden="true" />
              Email
            </a>
          )}
          <a
            href={`https://wa.me/91${enquiry.phone}?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 hover:bg-green-100"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border-grey bg-white p-6">
          <h2 className="text-lg font-semibold text-navy">Enquiry details</h2>
          <dl className="mt-2">
            <DetailRow label="Product" value={enquiry.product} />
            <DetailRow label="Project type" value={enquiry.projectType} />
            <DetailRow label="Location" value={enquiry.projectLocation} />
            <DetailRow label="Company" value={enquiry.company} />
            <DetailRow label="Colour" value={enquiry.colour} />
            <DetailRow label="Thickness" value={enquiry.thickness} />
            <DetailRow label="Length" value={enquiry.length} />
            <DetailRow label="Area" value={enquiry.area} />
            <DetailRow label="Surface material" value={enquiry.surfaceMaterial} />
            <DetailRow label="Delivery timeline" value={enquiry.deliveryTimeline} />
            <DetailRow label="Message" value={enquiry.message} />
            <DetailRow label="Source" value={enquiry.source} />
            <DetailRow label="Notification email" value={enquiry.emailSent ? "Sent to sales" : enquiry.emailError || "Not sent (SMTP not configured)"} />
          </dl>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6">
            <h2 className="text-lg font-bold text-navy">Update this lead</h2>
            <p className="mt-1 text-sm text-steel">Change status as you follow up. Notes are only visible in admin.</p>
            <label className="mt-4 block text-sm font-semibold text-charcoal">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
              className="mt-1.5 w-full rounded-lg border border-border-grey px-3 py-2.5 text-sm"
            >
              <option value="new">New — not contacted yet</option>
              <option value="contacted">Contacted — called / messaged</option>
              <option value="quoted">Quoted — price sent</option>
              <option value="closed">Closed — won or done</option>
              <option value="spam">Spam — ignore</option>
            </select>
            <p className="mt-1.5 text-xs text-steel">Pick where this enquiry is in your sales process.</p>
            <label className="mt-4 block text-sm font-semibold text-charcoal">Internal notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="e.g. Called on 27 Aug — needs 100mm panels for cold room in Goa. Follow up Friday."
              className="mt-1.5 w-full rounded-lg border border-border-grey px-3 py-2.5 text-sm placeholder:text-steel/55"
            />
            <p className="mt-1.5 text-xs text-steel">Private notes for your team — not shown to the customer.</p>
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="admin-btn admin-btn-primary mt-4 w-full"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => void onDelete()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete enquiry
          </button>
        </div>
      </div>
    </div>
  )
}
