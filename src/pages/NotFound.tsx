import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useDocumentMeta } from "@/hooks/useDocumentMeta"

export default function NotFound() {
  useDocumentMeta("Page Not Found", "The page you are looking for could not be found.")

  return (
    <div className="container-1280 flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold text-charcoal sm:text-4xl">Page Not Found</h1>
      <p className="mt-3 max-w-md text-steel">The page you're looking for doesn't exist or may have moved.</p>
      <Button asChild className="mt-6 bg-accent hover:bg-[#D94716]">
        <Link to="/">Return to Homepage</Link>
      </Button>
    </div>
  )
}
