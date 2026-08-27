import { useState, type FormEvent, type MouseEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, MessageCircle, ArrowRight } from "lucide-react"
import { submitEnquiry, phoneRegex, emailRegex } from "@/lib/enquiry"
import { buildWhatsAppUrl, enquiryWhatsAppMessage, logAndBuildWhatsAppUrl } from "@/lib/whatsapp"
import { projectTypes, deliveryTimelines } from "@/data/site"
import type { Enquiry } from "@/types"
import { Link } from "react-router-dom"

export interface EnquiryPrefill {
  product?: string
  colour?: string
  thickness?: string
  length?: string
  area?: string
  quantity?: string
  surfaceMaterial?: string
  application?: string
  projectLocation?: string
}

interface Props {
  prefill?: EnquiryPrefill
  productLocked?: boolean
  onSuccess?: (enquiry: Enquiry) => void
  compact?: boolean
}

type Errors = Partial<Record<"name" | "phone" | "email" | "projectLocation" | "projectType" | "consent", string>>

export default function EnquiryForm({ prefill, productLocked, onSuccess, compact }: Props) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [projectLocation, setProjectLocation] = useState(prefill?.projectLocation || "")
  const [projectType, setProjectType] = useState("")
  const [colour, setColour] = useState(prefill?.colour || "")
  const [thickness, setThickness] = useState(prefill?.thickness || "")
  const [length, setLength] = useState(prefill?.length || "")
  const [area, setArea] = useState(prefill?.area || "")
  const [deliveryTimeline, setDeliveryTimeline] = useState("")
  const [message, setMessage] = useState("")
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<Enquiry | null>(null)

  function validate(): Errors {
    const next: Errors = {}
    if (!name.trim()) next.name = "Please enter your full name."
    if (!phoneRegex.test(phone.trim())) next.phone = "Enter a valid 10-digit Indian mobile number."
    if (email.trim() && !emailRegex.test(email.trim())) next.email = "Enter a valid email address."
    if (!projectLocation.trim()) next.projectLocation = "Please enter your project location or city."
    if (!projectType) next.projectType = "Please select a project type."
    if (!consent) next.consent = "Please provide consent to be contacted."
    return next
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const enquiry = await submitEnquiry({
        product: prefill?.product || "General Enquiry",
        colour,
        thickness,
        length,
        area,
        quantity: prefill?.quantity || "",
        surfaceMaterial: prefill?.surfaceMaterial || "",
        application: prefill?.application || "",
        projectLocation,
        projectType,
        name,
        phone,
        email,
        company,
        deliveryTimeline,
        message,
        consent,
        source: prefill?.product ? "product" : "enquire",
      })
      setSuccess(enquiry)
      onSuccess?.(enquiry)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const isInvalid = !name.trim() || !phoneRegex.test(phone.trim()) || !projectLocation.trim() || !projectType || !consent

  if (success) {
    const successMessage = enquiryWhatsAppMessage({
      referenceId: success.id,
      product: success.product,
      name: success.name,
      projectLocation: success.projectLocation,
    })
    const successHref = buildWhatsAppUrl(successMessage)

    async function openEnquiryWhatsApp(e: MouseEvent<HTMLAnchorElement>) {
      e.preventDefault()
      const href = await logAndBuildWhatsAppUrl(
        {
          source: "enquiry_success",
          product: success.product,
          enquiryReferenceId: success.id,
          message: successMessage,
        },
        successMessage
      )
      window.open(href, "_blank", "noopener,noreferrer")
    }

    return (
      <div className="py-8 text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
          <ArrowRight className="size-6" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold text-charcoal">Thank you. Your enquiry has been received.</h3>
        <p className="mt-2 text-steel">
          Our technical sales team will review your requirement and contact you within one business day.
        </p>
        <p className="mt-1 text-sm text-steel">Reference ID: {success.id}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-[#25D366] text-white hover:bg-[#1ebe57]">
            <a href={successHref} target="_blank" rel="noreferrer" onClick={(e) => void openEnquiryWhatsApp(e)}>
              <MessageCircle className="mr-2 size-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/products">Explore More Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={compact ? "space-y-4" : "space-y-5"}>
      {prefill?.product && (
        <div>
          <Label htmlFor="ef-product">Product</Label>
          <Input id="ef-product" value={prefill.product} readOnly disabled={productLocked} className="mt-1.5 bg-muted" />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ef-name">Full Name *</Label>
          <Input id="ef-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" aria-invalid={!!errors.name} aria-describedby={errors.name ? "ef-name-err" : undefined} />
          {errors.name && <p id="ef-name-err" role="alert" className="mt-1 text-sm text-destructive">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="ef-phone">Mobile Number *</Label>
          <Input id="ef-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" maxLength={10} className="mt-1.5" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "ef-phone-err" : undefined} />
          {errors.phone && <p id="ef-phone-err" role="alert" className="mt-1 text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ef-email">Work Email</Label>
          <Input id="ef-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" aria-invalid={!!errors.email} aria-describedby={errors.email ? "ef-email-err" : undefined} />
          {errors.email && <p id="ef-email-err" role="alert" className="mt-1 text-sm text-destructive">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="ef-company">Company Name</Label>
          <Input id="ef-company" value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1.5" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ef-location">Project Location / City *</Label>
          <Input id="ef-location" value={projectLocation} onChange={(e) => setProjectLocation(e.target.value)} className="mt-1.5" aria-invalid={!!errors.projectLocation} aria-describedby={errors.projectLocation ? "ef-location-err" : undefined} />
          {errors.projectLocation && <p id="ef-location-err" role="alert" className="mt-1 text-sm text-destructive">{errors.projectLocation}</p>}
        </div>
        <div>
          <Label htmlFor="ef-type">Project Type *</Label>
          <Select value={projectType} onValueChange={setProjectType}>
            <SelectTrigger id="ef-type" className="mt-1.5 w-full" aria-invalid={!!errors.projectType}>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectType && <p role="alert" className="mt-1 text-sm text-destructive">{errors.projectType}</p>}
        </div>
      </div>

      {prefill?.product && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="ef-colour">Colour</Label>
            <Input id="ef-colour" value={colour} onChange={(e) => setColour(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="ef-thickness">Thickness</Label>
            <Input id="ef-thickness" value={thickness} onChange={(e) => setThickness(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="ef-length">Required Length (m)</Label>
            <Input id="ef-length" value={length} onChange={(e) => setLength(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="ef-area">Required Area (sq ft)</Label>
            <Input id="ef-area" value={area} onChange={(e) => setArea(e.target.value)} className="mt-1.5" />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="ef-delivery">Delivery Timeline</Label>
        <Select value={deliveryTimeline} onValueChange={setDeliveryTimeline}>
          <SelectTrigger id="ef-delivery" className="mt-1.5 w-full">
            <SelectValue placeholder="Select delivery timeline (optional)" />
          </SelectTrigger>
          <SelectContent>
            {deliveryTimelines.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="ef-message">Additional Requirement</Label>
        <Textarea id="ef-message" value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1.5" rows={3} />
      </div>

      <div className="flex items-start gap-2">
        <Checkbox id="ef-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} aria-invalid={!!errors.consent} className="mt-0.5" />
        <div>
          <Label htmlFor="ef-consent" className="font-normal leading-snug">
            I consent to MountRoof contacting me via phone, WhatsApp or email regarding this enquiry. *
          </Label>
          {errors.consent && <p role="alert" className="mt-1 text-sm text-destructive">{errors.consent}</p>}
        </div>
      </div>

      {submitError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isInvalid || submitting} className="w-full bg-accent hover:bg-[#D94716] disabled:opacity-50">
        {submitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> Submitting...
          </>
        ) : (
          "Submit Enquiry"
        )}
      </Button>
    </form>
  )
}
