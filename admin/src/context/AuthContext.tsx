import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  clearSession,
  fetchMe,
  getStoredToken,
  getStoredUser,
  login as apiLogin,
  logout as apiLogout,
  type AdminUser,
} from "@/lib/api"

type AuthContextValue = {
  user: AdminUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(getStoredUser())
  const [token, setToken] = useState<string | null>(getStoredToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function hydrate() {
      const stored = getStoredToken()
      if (!stored) {
        if (!cancelled) setLoading(false)
        return
      }
      try {
        const me = await fetchMe(stored)
        if (!cancelled) {
          setUser(me)
          setToken(stored)
        }
      } catch {
        clearSession()
        if (!cancelled) {
          setUser(null)
          setToken(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token: nextToken, user: nextUser } = await apiLogin(email, password)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const logout = useCallback(async () => {
    await apiLogout(token)
    setToken(null)
    setUser(null)
  }, [token])

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
