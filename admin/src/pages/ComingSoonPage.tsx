import { Link } from "react-router-dom"

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="admin-page">
      <h1 className="text-2xl font-bold text-navy">{title}</h1>
      <p className="mt-2 max-w-xl text-steel">
        This section is planned for a later phase. Phase 0 only delivers login, auth guard, and the
        dashboard shell.
      </p>
      <Link to="/" className="mt-6 inline-block text-sm font-medium text-accent hover:underline">
        ← Back to dashboard
      </Link>
    </div>
  )
}
