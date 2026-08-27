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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-mid to-[#0a1622]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(232,93,42,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08), transparent 35%)",
        }}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div className="border-b border-border-grey bg-surface px-8 py-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-navy text-lg font-extrabold text-white">
              M
            </span>
            <div>
              <p className="text-lg font-extrabold text-navy">MountRoof</p>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-steel">Admin sign in</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-8 py-7">
          <p className="text-sm text-steel">Manage products, applications, blogs, enquiries and site settings.</p>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-charcoal">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="admin-input mt-1.5"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-charcoal">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-input mt-1.5"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary w-full py-3">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
