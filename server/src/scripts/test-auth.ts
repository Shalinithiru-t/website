/**
 * Phase 0 automated auth smoke test.
 * Run with: npm run test:auth  (server must be running)
 */
const API = process.env.API_URL || "http://localhost:4000"

type Json = Record<string, unknown>

async function request(path: string, options: RequestInit = {}): Promise<{ status: number; body: Json }> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })
  const body = (await res.json()) as Json
  return { status: res.status, body }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAIL: ${message}`)
  console.log(`  ✓ ${message}`)
}

async function run() {
  console.log(`\nPhase 0 auth tests → ${API}\n`)

  // 1. Health
  {
    const { status, body } = await request("/api/health")
    assert(status === 200 && body.success === true, "GET /api/health returns 200")
  }

  // 2. Login rejects bad password
  {
    const { status, body } = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@mountroof.com", password: "wrong-password" }),
    })
    assert(status === 401 && body.success === false, "Login rejects invalid password")
  }

  // 3. Login succeeds
  let token = ""
  {
    const { status, body } = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || "admin@mountroof.com",
        password: process.env.ADMIN_PASSWORD || "Admin@12345",
      }),
    })
    assert(status === 200 && body.success === true, "Login succeeds with seed credentials")
    assert(typeof body.token === "string" && (body.token as string).length > 10, "Login returns JWT token")
    token = body.token as string
  }

  // 4. /me without token
  {
    const { status } = await request("/api/auth/me")
    assert(status === 401, "GET /api/auth/me without token returns 401")
  }

  // 5. /me with token
  {
    const { status, body } = await request("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200 && body.success === true, "GET /api/auth/me with token returns user")
    const user = body.user as Json
    assert(user.email === "admin@mountroof.com", "Authenticated user email matches seed admin")
  }

  // 6. Protected admin dashboard
  {
    const { status, body } = await request("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200 && body.success === true, "GET /api/admin/dashboard with token works")
  }

  // 7. Protected route without token
  {
    const { status } = await request("/api/admin/dashboard")
    assert(status === 401, "GET /api/admin/dashboard without token returns 401")
  }

  console.log("\nAll Phase 0 auth tests passed.\n")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
