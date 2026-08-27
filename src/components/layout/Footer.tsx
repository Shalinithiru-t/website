import { Link } from "react-router-dom"
import { Globe, Share2, AtSign, Mail, Phone, MapPin } from "lucide-react"
import { navProducts, navApplications, footerCompanyLinks } from "@/data/site"
import { useSiteInfo } from "@/context/SiteInfoContext"

export default function Footer() {
  const siteInfo = useSiteInfo()

  return (
    <footer className="bg-charcoal text-white/80 pb-16 lg:pb-0">
      <div className="container-1440 grid gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-10 lg:py-20">
        <div>
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-white">
            <span className="flex size-9 items-center justify-center rounded-md bg-accent text-white">M</span>
            MountRoof
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Insulated PUF panels, roofing systems and PEB structures engineered for India's industrial and cold-chain construction.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="MountRoof on LinkedIn" className="flex size-9 items-center justify-center rounded-full border border-white/20 hover:border-accent hover:text-accent"><Share2 className="size-4" /></a>
            <a href="#" aria-label="MountRoof on Facebook" className="flex size-9 items-center justify-center rounded-full border border-white/20 hover:border-accent hover:text-accent"><Globe className="size-4" /></a>
            <a href="#" aria-label="MountRoof on Twitter" className="flex size-9 items-center justify-center rounded-full border border-white/20 hover:border-accent hover:text-accent"><AtSign className="size-4" /></a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Products</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navProducts.map((p) => (
              <li key={p.to}><Link to={p.to} className="text-white/60 hover:text-accent">{p.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Applications</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navApplications.map((a) => (
              <li key={a.to}><Link to={a.to} className="text-white/60 hover:text-accent">{a.label}</Link></li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-white">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {footerCompanyLinks.map((c) => (
              <li key={c.to}><Link to={c.to} className="text-white/60 hover:text-accent">{c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{siteInfo.address}</li>
            <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><a href={`mailto:${siteInfo.email}`} className="hover:text-accent">{siteInfo.email}</a></li>
            {siteInfo.salesEmail !== siteInfo.email && (
              <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><a href={`mailto:${siteInfo.salesEmail}`} className="hover:text-accent">{siteInfo.salesEmail}</a></li>
            )}
            <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><a href={siteInfo.phoneHref} className="hover:text-accent">{siteInfo.phone}</a></li>
          </ul>
        </div>
      </div>

      <div className="container-1440 flex flex-col gap-3 border-t border-white/10 px-4 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>© {siteInfo.year} {siteInfo.legalName}</p>
        <div className="flex gap-4">
          <Link to="/privacy-policy" className="hover:text-accent">Privacy Policy</Link>
          <Link to="/terms-and-conditions" className="hover:text-accent">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  )
}
