import type { Application } from "@/types"

export const applications: Application[] = [
  {
    slug: "warehouses",
    name: "Warehouses & Logistics",
    shortDescription: "Insulated roofing, wall envelopes and PEB structures for high-throughput logistics facilities.",
    heroDescription:
      "Large-format distribution centres and logistics parks need building envelopes that go up fast, control internal temperature, and stand up to decades of operational wear. MountRoof supplies long-span roofing, wall cladding and pre-engineered building systems purpose-built for warehousing and logistics.",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1600&auto=format&fit=crop",
    recommendedProductSlugs: ["roof-puf-panels", "wall-puf-panels", "solar-profiled-roof-panels"],
    keyRequirements: [
      "Long-span roofing to minimise internal columns",
      "Fast, dry installation to compress build schedules",
      "Durable surface finishes for decades of low-maintenance service",
      "Solar-ready roofing for future rooftop PV installations",
    ],
    relatedProjectSlugs: ["bengaluru-logistics-park", "pune-fmcg-distribution-center"],
  },
  {
    slug: "cold-storage",
    name: "Cold Storage",
    shortDescription: "Temperature-engineered PUF panels for chilled and frozen storage facilities.",
    heroDescription:
      "From chilled distribution hubs to sub-zero blast freezing rooms, cold chain infrastructure demands precisely engineered insulation. MountRoof Cold Room Panels are specified against your exact temperature and load requirements to deliver energy-efficient, condensation-free cold storage.",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1600&auto=format&fit=crop",
    recommendedProductSlugs: ["cold-room-panels", "wall-puf-panels"],
    keyRequirements: [
      "Core thickness engineered for target internal temperature",
      "Vapour-sealed, condensation-resistant joints",
      "Hygienic, easy-to-clean surface finishes",
      "Airtight cam-lock panel assembly",
    ],
    relatedProjectSlugs: ["hyderabad-cold-chain-hub", "nashik-frozen-foods-facility"],
  },
  {
    slug: "food-processing",
    name: "Food Processing",
    shortDescription: "Hygienic wall and cold-room panel systems designed for food-grade manufacturing environments.",
    heroDescription:
      "Food processing facilities require wall and ceiling systems that meet strict hygiene standards while withstanding washdown cycles and temperature variation. MountRoof supplies plain-profile wall panels and cold-room systems finished for food-grade compliance.",
    image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1600&auto=format&fit=crop",
    recommendedProductSlugs: ["wall-puf-panels", "cold-room-panels", "hidden-tongue-groove-panels"],
    keyRequirements: [
      "Smooth, plain-profile surfaces for easy sanitation",
      "Panel joints sealed against bacterial ingress",
      "Compatibility with chilled and ambient processing zones",
      "Food-grade coating options",
    ],
    relatedProjectSlugs: ["nashik-frozen-foods-facility", "pune-fmcg-distribution-center"],
  },
  {
    slug: "pharma-cleanrooms",
    name: "Pharma & Cleanrooms",
    shortDescription: "Controlled-environment insulated wall systems for pharmaceutical manufacturing.",
    heroDescription:
      "Pharmaceutical manufacturing and cleanroom environments demand precise control of temperature, humidity and contamination. MountRoof insulated wall panels support controlled-environment construction with hygienic, low-particulate surface finishes.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1600&auto=format&fit=crop",
    recommendedProductSlugs: ["wall-puf-panels", "cold-room-panels"],
    keyRequirements: [
      "Low-particulate, cleanable surface finishes",
      "Airtight joinery for controlled environment pressure zones",
      "Stainless steel surface options for cGMP compliance",
      "Consistent thermal performance for HVAC efficiency",
    ],
    relatedProjectSlugs: ["hyderabad-cold-chain-hub"],
  },
  {
    slug: "industrial-facilities",
    name: "Industrial Facilities",
    shortDescription: "Complete roofing, wall and PEB systems for manufacturing plants and industrial units.",
    heroDescription:
      "Manufacturing plants and industrial facilities need a building envelope engineered for durability under continuous operational stress. MountRoof supplies integrated roofing, wall cladding and pre-engineered building systems for industrial-scale construction across India.",
    image: "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?q=80&w=1600&auto=format&fit=crop",
    recommendedProductSlugs: ["roof-puf-panels", "wall-puf-panels", "hidden-tongue-groove-panels"],
    keyRequirements: [
      "Structural roofing and wall systems for PEB frameworks",
      "Durability under continuous industrial operating conditions",
      "Custom specifications for varied plant layouts",
      "Technical support for structural coordination",
    ],
    relatedProjectSlugs: ["bengaluru-logistics-park", "chennai-auto-component-plant"],
  },
]

export function getApplicationBySlug(slug: string) {
  return applications.find((a) => a.slug === slug)
}
