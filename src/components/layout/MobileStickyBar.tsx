import { Link } from "react-router-dom"
import { Phone, MessageCircle, FileText } from "lucide-react"
import { siteInfo } from "@/data/site"

export default function MobileStickyBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border-grey bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a href={siteInfo.phoneHref} className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium text-navy" style={{ minHeight: 44 }}>
        <Phone className="size-5" aria-hidden="true" />
        Call Now
      </a>
      <a href={siteInfo.whatsappHref} target="_blank" rel="noreferrer" className="flex flex-1 flex-col items-center gap-1 border-x border-border-grey py-2.5 text-xs font-medium text-success" style={{ minHeight: 44 }}>
        <MessageCircle className="size-5" aria-hidden="true" />
        WhatsApp
      </a>
      <Link to="/enquire" className="flex flex-1 flex-col items-center gap-1 bg-accent py-2.5 text-xs font-medium text-white" style={{ minHeight: 44 }}>
        <FileText className="size-5" aria-hidden="true" />
        Get a Quote
      </Link>
    </nav>
  )
}
