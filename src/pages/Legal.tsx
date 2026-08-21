import Breadcrumb from "@/components/shared/Breadcrumb"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"

export function PrivacyPolicy() {
  useDocumentMeta("Privacy Policy", "MountRoof's privacy policy covering how we collect and use enquiry and project information.")
  return (
    <div className="container-1280 px-4 py-16 sm:px-6 lg:px-10">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />
      <h1 className="mt-4 text-3xl font-bold text-charcoal">Privacy Policy</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-steel">
        <p>Mount Roofing & Structures Pvt. Ltd. ("MountRoof") collects contact and project information you submit through our enquiry forms solely to respond to your project requirements and provide relevant quotations.</p>
        <p>We do not sell or share your personal information with third parties outside of our direct project fulfilment and logistics partners, and only to the extent necessary to service your enquiry.</p>
        <p>For any questions about how your data is used, please contact us at info@mountroof.com.</p>
      </div>
    </div>
  )
}

export function TermsAndConditions() {
  useDocumentMeta("Terms and Conditions", "MountRoof's terms and conditions governing use of this website and quotations provided.")
  return (
    <div className="container-1280 px-4 py-16 sm:px-6 lg:px-10">
      <Breadcrumb items={[{ label: "Terms and Conditions" }]} />
      <h1 className="mt-4 text-3xl font-bold text-charcoal">Terms and Conditions</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-steel">
        <p>All product specifications, pricing and lead times provided through this website are indicative and subject to confirmation by MountRoof's technical sales team prior to order confirmation.</p>
        <p>Final panel thickness, core material and surface finish for any project are confirmed in writing following a technical review of your specific requirements.</p>
        <p>Use of this website constitutes acceptance of these terms. For any queries, please contact sales@mountroof.com.</p>
      </div>
    </div>
  )
}
