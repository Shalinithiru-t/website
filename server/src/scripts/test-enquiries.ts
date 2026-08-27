/**
 * Phase 3 enquiry API smoke tests.
 * Run: npm run test:enquiries  (server must be running)
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

const sampleEnquiry = {
  product: "Roof PUF Sandwich Panels",
  colour: "Sky Blue",
  thickness: "80mm",
  length: "12m",
  area: "5000",
  quantity: "",
  surfaceMaterial: "PPGI",
  application: "Warehouses",
  projectLocation: "Pune",
  projectType: "Warehouse / Logistics Facility",
  name: "Test Lead",
  phone: "9876543210",
  email: "test@example.com",
  company: "Test Co",
  deliveryTimeline: "1 Month",
  message: "Phase 3 smoke test enquiry",
  consent: true,
  source: "other",
}

async function run() {
  console.log(`\nPhase 3 enquiry tests → ${API}\n`)

  const login = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL || "admin@mountroof.com",
      password: process.env.ADMIN_PASSWORD || "Admin@12345",
    }),
  })
  assert(login.status === 200, "Admin login works")
  const token = login.body.token as string

  let enquiryId = ""
  let referenceId = ""
  {
    const { status, body } = await request("/api/enquiries", {
      method: "POST",
      body: JSON.stringify(sampleEnquiry),
    })
    assert(status === 201 && body.success === true, "POST /api/enquiries creates enquiry")
    const enquiry = body.enquiry as Json
    referenceId = enquiry.id as string
    assert(referenceId.startsWith("MR-"), "Returns reference ID")
    assert(typeof body.emailSent === "boolean", "Returns emailSent flag")
  }

  {
    const { status, body } = await request("/api/admin/enquiries", {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200, "GET /api/admin/enquiries works")
    const enquiries = body.enquiries as Json[]
    const found = enquiries.find((e) => e.referenceId === referenceId)
    assert(Boolean(found), "Enquiry appears in admin list")
    enquiryId = (found as Json).id as string
  }

  {
    const { status, body } = await request(`/api/admin/enquiries/${enquiryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200, "GET /api/admin/enquiries/:id works")
    assert((body.enquiry as Json).phone === "9876543210", "Enquiry detail matches")
  }

  {
    const { status, body } = await request(`/api/admin/enquiries/${enquiryId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "contacted", notes: "Called the lead" }),
    })
    assert(status === 200, "PATCH updates status and notes")
    assert((body.enquiry as Json).status === "contacted", "Status is contacted")
  }

  {
    const { status, body } = await request("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200, "Dashboard includes enquiry stats")
    assert((body.stats as Json).phase === "3", "Dashboard phase is 3")
  }

  {
    const { status } = await request(`/api/admin/enquiries/${enquiryId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    assert(status === 200, "DELETE removes test enquiry")
  }

  {
    const { status, body } = await request("/api/enquiries", {
      method: "POST",
      body: JSON.stringify({ ...sampleEnquiry, phone: "12345", consent: true }),
    })
    assert(status === 400, "Invalid phone rejected")
    assert(body.success === false, "Validation error returned")
  }

  console.log("\nAll Phase 3 enquiry tests passed.\n")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
