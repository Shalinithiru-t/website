import { useEffect, useState, type FormEvent } from "react"
import { useAuth } from "@/context/AuthContext"
import { fetchAdminSettings, updateAdminSettings, type SiteSettingsInput } from "@/lib/api"
import { FieldHint, SectionTitle, fieldClass, labelClass } from "@/components/FormField"

export default function SettingsPage() {
  const { token } = useAuth()
  const [form, setForm] = useState<SiteSettingsInput>({
    phone: "",
    phoneDigits: "",
    whatsappPhone: "",
    whatsappDigits: "",
    email: "",
    salesEmail: "",
    address: "",
    addressShort: "",
    mapEmbedUrl: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!token) return
    fetchAdminSettings(token)
      .then((s) => {
        setForm({
          phone: s.phone,
          phoneDigits: s.phoneDigits,
          whatsappPhone: s.whatsappPhone || s.phone,
          whatsappDigits: s.whatsappDigits || s.phoneDigits,
          email: s.email,
          salesEmail: s.salesEmail,
          address: s.address,
          addressShort: s.addressShort,
          mapEmbedUrl: s.mapEmbedUrl,
        })
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load settings"))
      .finally(() => setLoading(false))
  }, [token])

  function setField<K extends keyof SiteSettingsInput>(key: K, value: SiteSettingsInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setError("")
    setSaved(false)
    try {
      const updated = await updateAdminSettings(token, {
        ...form,
        phoneDigits: form.phoneDigits.replace(/\D/g, ""),
        whatsappDigits: form.whatsappDigits.replace(/\D/g, ""),
      })
      setForm({
        phone: updated.phone,
        phoneDigits: updated.phoneDigits,
        whatsappPhone: updated.whatsappPhone,
        whatsappDigits: updated.whatsappDigits,
        email: updated.email,
        salesEmail: updated.salesEmail,
        address: updated.address,
        addressShort: updated.addressShort,
        mapEmbedUrl: updated.mapEmbedUrl,
      })
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-page text-steel">Loading settings…</div>

  return (
    <div className="admin-page">
      <h2 className="admin-page-title">Site Settings</h2>
      <p className="admin-page-desc">
        These contacts show on the public website (header, footer, Contact page, WhatsApp buttons). Use the examples
        under each field.
      </p>

      <form onSubmit={onSubmit} className="admin-card mt-6 w-full space-y-8 p-6 sm:p-8">
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {saved && (
          <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
            Settings saved. Refresh the public site to see updates.
          </p>
        )}

        <section>
          <SectionTitle
            title="Call Us"
            desc="Phone number for the Call Us card and header call link."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor="phone">
                Display number *
              </label>
              <input
                id="phone"
                className={fieldClass}
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+91 90356 62840"
                required
              />
              <FieldHint>How it looks on the website (with spaces / +91).</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="phoneDigits">
                Dial digits *
              </label>
              <input
                id="phoneDigits"
                className={fieldClass}
                value={form.phoneDigits}
                onChange={(e) => setField("phoneDigits", e.target.value.replace(/\D/g, ""))}
                placeholder="919035662840"
                inputMode="numeric"
                required
              />
              <FieldHint>Numbers only with country code — used for tel: links. Example: 919035662840</FieldHint>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle
            title="WhatsApp"
            desc="Can be a different number from Call Us. Used for Book Now and chat buttons."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor="whatsappPhone">
                Display number *
              </label>
              <input
                id="whatsappPhone"
                className={fieldClass}
                value={form.whatsappPhone}
                onChange={(e) => setField("whatsappPhone", e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
              <FieldHint>Shown on the Contact WhatsApp card.</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="whatsappDigits">
                WhatsApp digits *
              </label>
              <input
                id="whatsappDigits"
                className={fieldClass}
                value={form.whatsappDigits}
                onChange={(e) => setField("whatsappDigits", e.target.value.replace(/\D/g, ""))}
                placeholder="919876543210"
                inputMode="numeric"
                required
              />
              <FieldHint>Numbers only with country code for wa.me links. Example: 919876543210</FieldHint>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle title="Emails" desc="General vs sales — shown as two separate Contact cards." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor="email">
                General Enquiries *
              </label>
              <input
                id="email"
                type="email"
                className={fieldClass}
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="info@yourcompany.com"
                required
              />
              <FieldHint>Public “General Enquiries” mailto address.</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="salesEmail">
                Sales Team *
              </label>
              <input
                id="salesEmail"
                type="email"
                className={fieldClass}
                value={form.salesEmail}
                onChange={(e) => setField("salesEmail", e.target.value)}
                placeholder="sales@yourcompany.com"
                required
              />
              <FieldHint>Also used for enquiry notification emails when SMTP is set up.</FieldHint>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle title="Office address & map" desc="Shown on Contact and footer." />
          <div className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="address">
                Full address *
              </label>
              <textarea
                id="address"
                className={fieldClass}
                rows={2}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="42, Kapila Nagar, Doddanna Industrial Estate, Peenya, Bengaluru, Karnataka 560058"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="addressShort">
                Short address
              </label>
              <input
                id="addressShort"
                className={fieldClass}
                value={form.addressShort}
                onChange={(e) => setField("addressShort", e.target.value)}
                placeholder="Peenya, Bengaluru, Karnataka"
              />
              <FieldHint>Optional shorter line for compact layouts.</FieldHint>
            </div>
            <div>
              <label className={labelClass} htmlFor="mapEmbedUrl">
                Google Maps embed URL
              </label>
              <textarea
                id="mapEmbedUrl"
                className={fieldClass}
                rows={3}
                value={form.mapEmbedUrl}
                onChange={(e) => setField("mapEmbedUrl", e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=…"
              />
              <FieldHint>
                Google Maps → Share → Embed a map → copy only the <strong>src</strong> URL from the iframe (starts with
                https://www.google.com/maps/embed…).
              </FieldHint>
            </div>
          </div>
        </section>

        <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  )
}
