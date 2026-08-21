import Breadcrumb from "@/components/shared/Breadcrumb"
import FadeUp from "@/components/shared/FadeUp"
import EnquiryForm from "@/components/shared/EnquiryForm"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"

export default function Enquire() {
  useDocumentMeta(
    "Get a Quote",
    "Request a project quote from MountRoof for insulated PUF panels, roofing systems, wall panels, cold room panels or PEB structures."
  )

  return (
    <div>
      <div className="bg-navy py-16 text-white">
        <div className="container-1280 px-4 sm:px-6 lg:px-10">
          <Breadcrumb items={[{ label: "Get a Quote" }]} dark />
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Get a Project Quote</h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Tell us about your project and our technical sales team will follow up with a tailored recommendation and quote within one business day.
          </p>
        </div>
      </div>

      <div className="container-1280 px-4 py-20 sm:px-6 lg:px-10">
        <FadeUp className="mx-auto max-w-2xl rounded-2xl border border-border-grey bg-white p-6 shadow-sm sm:p-8">
          <EnquiryForm />
        </FadeUp>
      </div>
    </div>
  )
}
