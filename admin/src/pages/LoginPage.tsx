import { useState, type FormEvent } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const { user, loading, login } = useAuth()
  const [email, setEmail] = useState("admin@mountroof.com")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-navy">MountRoof Admin</h1>
          <p className="mt-1 text-sm text-steel">Sign in to manage products, blogs and enquiries</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-border-grey px-3 py-2.5 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-border-grey px-3 py-2.5 text-sm outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#D94716] disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-steel">
          Phase 0 seed: <code className="rounded bg-surface px-1">admin@mountroof.com</code>
        </p>
      </div>
    </div>
  )
}
