/**
 * Phase 1 products API smoke tests.
 * Run: npm run test:products  (server must be running + seeded)
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
  console.log(`\nPhase 1 product tests → ${API}\n`)

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
    const { status, body } = await request("/api/products")
    assert(status === 200 && body.success === true, "GET /api/products returns published list")
    const products = body.products as unknown[]
    assert(Array.isArray(products) && products.length >= 1, "At least one published product exists")
  }

  {
    const { status, body } = await request("/api/products/roof-puf-panels")
    assert(status === 200 && body.success === true, "GET /api/products/roof-puf-panels works")
    const product = body.product as Json
    assert(product.slug === "roof-puf-panels", "Product slug matches")
  }

  {
    const { status } = await request("/api/products/does-not-exist")
    assert(status === 404, "Missing product returns 404")
  }

  {
    const { status, body } = await request("/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200, "GET /api/admin/products works")
    const products = body.products as unknown[]
    assert(products.length >= 5, "Admin sees seeded products")
  }

  {
    const { status, body } = await request("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200, "Dashboard returns product counts")
    const stats = body.stats as Json
    assert(typeof stats.products === "number" && (stats.products as number) >= 1, "Dashboard products > 0")
    assert(stats.phase === "1", "Dashboard phase is 1")
  }

  // Create → update → delete draft product
  let createdId = ""
  {
    const payload = {
      slug: "test-temp-panel",
      name: "Test Temp Panel",
      shortName: "Test Panel",
      category: "Test",
      categoryFilter: "Roofing",
      shortDescription: "Temporary product for API test",
      heroDescription: "Temporary product hero for API smoke test only.",
      images: [{ url: "https://example.com/test.jpg", alt: "Test" }],
      benefits: [],
      specifications: { Width: "1000mm" },
      thicknessOptions: ["50mm"],
      colourOptions: [{ name: "White", hex: "#FFFFFF" }],
      surfaceMaterialOptions: ["PPGI"],
      applicationTags: ["Warehouses"],
      faq: [],
      relatedProductSlugs: [],
      datasheetUrl: "#",
      trustPoints: [],
      statTiles: [],
      status: "draft",
      sortOrder: 99,
    }
    const { status, body } = await request("/api/admin/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
    assert(status === 201, "POST creates draft product")
    createdId = (body.product as Json).id as string

    const pub = await request("/api/products/test-temp-panel")
    assert(pub.status === 404, "Draft product is hidden from public API")
  }

  {
    const { status, body } = await request(`/api/admin/products/${createdId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        slug: "test-temp-panel",
        name: "Test Temp Panel Updated",
        shortName: "Test Panel",
        category: "Test",
        categoryFilter: "Roofing",
        shortDescription: "Updated temporary product",
        heroDescription: "Updated hero text for smoke test.",
        images: [{ url: "https://example.com/test.jpg", alt: "Test" }],
        benefits: [],
        specifications: { Width: "1100mm" },
        thicknessOptions: ["50mm", "80mm"],
        colourOptions: [{ name: "White", hex: "#FFFFFF" }],
        surfaceMaterialOptions: ["PPGI"],
        applicationTags: ["Warehouses"],
        faq: [],
        relatedProductSlugs: [],
        datasheetUrl: "#",
        trustPoints: [],
        statTiles: [],
        status: "published",
        sortOrder: 99,
      }),
    })
    assert(status === 200, "PUT updates product")
    assert((body.product as Json).status === "published", "Status set to published")

    const pub = await request("/api/products/test-temp-panel")
    assert(pub.status === 200, "Published product appears on public API")
  }

  {
    const { status } = await request(`/api/admin/products/${createdId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200, "DELETE removes product")
    const gone = await request("/api/products/test-temp-panel")
    assert(gone.status === 404, "Deleted product gone from public API")
  }

  console.log("\nAll Phase 1 product tests passed.\n")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
