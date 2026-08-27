/**
 * Phase 2 blogs API smoke tests.
 * Run: npm run test:blogs  (server must be running + seeded)
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
  console.log(`\nPhase 2 blog tests → ${API}\n`)

  const login = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || "admin@mountroof.com",
      password: process.env.ADMIN_PASSWORD || "Admin@12345",
    }),
  })
  assert(login.status === 200, "Admin login works")
  const token = login.body.token as string

  {
    const { status, body } = await request("/api/blogs")
    assert(status === 200 && body.success === true, "GET /api/blogs returns published list")
    const blogs = body.blogs as unknown[]
    assert(Array.isArray(blogs) && blogs.length >= 1, "At least one published blog exists")
  }

  {
    const { status, body } = await request("/api/blogs/choosing-right-panel-thickness")
    assert(status === 200 && body.success === true, "GET /api/blogs/:slug works")
    const blog = body.blog as Json
    assert(blog.slug === "choosing-right-panel-thickness", "Blog slug matches")
    assert(Array.isArray(blog.content) && (blog.content as unknown[]).length >= 1, "Blog has content paragraphs")
  }

  {
    const { status } = await request("/api/blogs/does-not-exist")
    assert(status === 404, "Missing blog returns 404")
  }

  {
    const { status, body } = await request("/api/admin/blogs", {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200, "GET /api/admin/blogs works")
    const blogs = body.blogs as unknown[]
    assert(blogs.length >= 4, "Admin sees seeded blogs")
  }

  {
    const { status, body } = await request("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200, "Dashboard returns blog counts")
    const stats = body.stats as Json
    assert(typeof stats.blogs === "number" && (stats.blogs as number) >= 1, "Dashboard blogs > 0")
    assert(stats.phase === "2", "Dashboard phase is 2")
  }

  let createdId = ""
  {
    const payload = {
      slug: "test-temp-blog",
      title: "Temporary Test Blog",
      excerpt: "Smoke test excerpt for Phase 2.",
      content: ["Paragraph one for the smoke test.", "Paragraph two for the smoke test."],
      category: "Technical Guide",
      readTime: "2 min read",
      date: "August 2026",
      image: "https://example.com/blog.jpg",
      author: "MountRoof",
      status: "draft",
      sortOrder: 99,
    }
    const { status, body } = await request("/api/admin/blogs", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    assert(status === 201, "POST creates draft blog")
    createdId = (body.blog as Json).id as string

    const pub = await request("/api/blogs/test-temp-blog")
    assert(pub.status === 404, "Draft blog is hidden from public API")
  }

  {
    const { status, body } = await request(`/api/admin/blogs/${createdId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        slug: "test-temp-blog",
        title: "Temporary Test Blog Updated",
        excerpt: "Updated smoke test excerpt.",
        content: ["Updated paragraph one.", "Updated paragraph two."],
        category: "Project Planning",
        readTime: "3 min read",
        date: "August 2026",
        image: "https://example.com/blog.jpg",
        author: "MountRoof",
        status: "published",
        sortOrder: 99,
      }),
    })
    assert(status === 200, "PUT updates blog")
    assert((body.blog as Json).status === "published", "Status set to published")

    const pub = await request("/api/blogs/test-temp-blog")
    assert(pub.status === 200, "Published blog appears on public API")
  }

  {
    const { status } = await request(`/api/admin/blogs/${createdId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200, "DELETE removes blog")
    const gone = await request("/api/blogs/test-temp-blog")
    assert(gone.status === 404, "Deleted blog gone from public API")
  }

  console.log("\nAll Phase 2 blog tests passed.\n")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
