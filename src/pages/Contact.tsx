import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react"
import Breadcrumb from "@/components/shared/Breadcrumb"
import FadeUp from "@/components/shared/FadeUp"
import EnquiryForm from "@/components/shared/EnquiryForm"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"
import { useSiteInfo } from "@/context/SiteInfoContext"

export default function Contact() {
  useDocumentMeta(
    "Contact Us",
    "Get in touch with MountRoof's technical sales team for PUF panel, roofing and PEB structure enquiries across India."
  )
  const siteInfo = useSiteInfo()

  return (
    <div>
      <div className="bg-navy py-16 text-white">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <Breadcrumb items={[{ label: "Contact" }]} dark />
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Talk to Our Technical Sales Team</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Whether you have drawings ready or are still scoping your project, our team is here to help you specify the right insulated panel solution.
          </p>
        </div>
      </div>

      <div className="container-1280 grid gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-10">
        <div>
          <FadeUp className="grid gap-4 sm:grid-cols-2">
            <a href={siteInfo.phoneHref} className="rounded-xl border border-border-grey bg-white p-5 hover:border-navy">
              <Phone className="size-6 text-accent" aria-hidden="true" />
              <p className="mt-3 font-semibold text-charcoal">Call Us</p>
              <p className="mt-1 text-sm text-steel">{siteInfo.phone}</p>
            </a>
            <a href={siteInfo.whatsappHref} target="_blank" rel="noreferrer" className="rounded-xl border border-border-grey bg-white p-5 hover:border-navy">
              <MessageCircle className="size-6 text-success" aria-hidden="true" />
              <p className="mt-3 font-semibold text-charcoal">WhatsApp</p>
              <p className="mt-1 text-sm text-steel">{siteInfo.whatsappPhone}</p>
            </a>
            <a href={`mailto:${siteInfo.email}`} className="rounded-xl border border-border-grey bg-white p-5 hover:border-navy">
              <Mail className="size-6 text-accent" aria-hidden="true" />
              <p className="mt-3 font-semibold text-charcoal">General Enquiries</p>
              <p className="mt-1 text-sm text-steel">{siteInfo.email}</p>
            </a>
            <a href={`mailto:${siteInfo.salesEmail}`} className="rounded-xl border border-border-grey bg-white p-5 hover:border-navy">
              <Mail className="size-6 text-accent" aria-hidden="true" />
              <p className="mt-3 font-semibold text-charcoal">Sales Team</p>
              <p className="mt-1 text-sm text-steel">{siteInfo.salesEmail}</p>
            </a>
          </FadeUp>

          <FadeUp delay={100} className="mt-8 rounded-xl border border-border-grey bg-white p-6">
            <h2 className="flex items-center gap-2 font-semibold text-charcoal">
              <MapPin className="size-5 text-accent" aria-hidden="true" />
              Office &amp; Factory Address
            </h2>
            <p className="mt-2 text-sm text-steel">{siteInfo.address}</p>
            <div className="mt-4 overflow-hidden rounded-lg border border-border-grey">
              <iframe
                title="MountRoof office location — Peenya, Bengaluru"
                src={siteInfo.mapEmbedUrl}
                className="h-56 w-full border-0 sm:h-64"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </FadeUp>

          <FadeUp delay={140} className="mt-6 flex items-start gap-2.5 rounded-xl bg-surface p-5 text-sm text-steel">
            <Clock className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden="true" />
            Our technical sales team typically responds to enquiries within one business day.
          </FadeUp>
        </div>

        <FadeUp delay={80} className="rounded-2xl border border-border-grey bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-charcoal">Send Us an Enquiry</h2>
          <div className="mt-6">
            <EnquiryForm />
          </div>
        </FadeUp>
      </div>
    </div>
  )
}
