import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

type SiteItem = {
  id: string
  name: string
  area: string
  description: string
  color: string
  coords: { x: number; y: number; r?: number; w?: number; h?: number; pts?: string }
}

type LayerItem = {
  id: string
  title: string
  description: string
  heightOffset: number
  color: string
}

type SpecItem = {
  id: string
  title: string
  description: string
  iconName: string
}

type IdealItem = {
  id: string
  title: string
  description: string
  iconName: string
}

export const siteElements: SiteItem[] = [
  {
    id: "site-house",
    name: "Main Residence Footprint",
    area: "218 m2",
    description: "Concrete floor slab-on-grade with full height glass and wood-clad profiles.",
    color: "#334155",
    coords: { x: 190, y: 70, w: 120, h: 110 },
  },
  {
    id: "site-pool",
    name: "Pool & Wetdeck System",
    area: "98 m2",
    description: "Quartz-wash infinity pool lined with dark basalt structural tiles.",
    color: "#0ea5e9",
    coords: { x: 210, y: 190, w: 100, h: 60 },
  },
  {
    id: "site-car",
    name: "Gravel Driveway & Parking",
    area: "85 m2",
    description: "Permeable flagstones and fine river gravel with space for charging systems.",
    color: "#64748b",
    coords: { x: 140, y: 60, w: 45, h: 100 },
  },
  {
    id: "site-garden",
    name: "Landscaped Buffers",
    area: "340 m2",
    description: "Drought-tolerant native plant beds, high conifers, and local stone retaining lines.",
    color: "#22c55e",
    coords: { x: 40, y: 40, w: 400, h: 260 },
  },
  {
    id: "site-lounge",
    name: "Sunken Gathering Terrace",
    area: "42 m2",
    description: "Recessed conversation node crafted in dry-pour concrete with in-ground chimney.",
    color: "#f97316",
    coords: { x: 320, y: 190, w: 60, h: 60 },
  },
]

export const axonometricLayers: LayerItem[] = [
  {
    id: "layer-roof",
    title: "FLAT ROOF",
    description:
      "Highly structural white parapet over roof garden pockets, equipped with high-efficiency solar panels and embedded rain capture lines.",
    heightOffset: -90,
    color: "#E2E8F0",
  },
  {
    id: "layer-slab",
    title: "ROOF SLAB",
    description:
      "Cast-in-place post-tensioned horizontal concrete beam grid offering exceptional insulation and solid thermal storage capacity.",
    heightOffset: -50,
    color: "#CBD5E1",
  },
  {
    id: "layer-walls",
    title: "WALLS & STRUCTURE",
    description:
      "Exposed architectural cast concrete load-bearing wall frames paired with warm timber-covered acoustic partitions and column plates.",
    heightOffset: 0,
    color: "#94A3B8",
  },
  {
    id: "layer-interior",
    title: "INTERIOR LAYOUT",
    description:
      "Custom built-in wood furniture blocks, luxury couches, master bedding suite, double bathroom basins, and stone kitchen island setup.",
    heightOffset: 40,
    color: "#64748B",
  },
  {
    id: "layer-foundation",
    title: "FOUNDATION",
    description:
      "Insulated concrete slab-on-grade with integrated water heating loops, expanding outwards to the terrace decks and raw pool cavity.",
    heightOffset: 95,
    color: "#475569",
  },
]

export const constructionSpecs: SpecItem[] = [
  {
    id: "cs-1",
    title: "Reinforced concrete structure",
    description: "Seismic-resistant, high-thermal cast in-situ framing.",
    iconName: "Layers",
  },
  {
    id: "cs-2",
    title: "Thermal insulation",
    description: "High density eco-wool and insulated air cavities.",
    iconName: "Thermometer",
  },
  {
    id: "cs-3",
    title: "Aluminum double glazing",
    description: "Low-E glass coated panels with double structural seals.",
    iconName: "Grid",
  },
  {
    id: "cs-4",
    title: "Waterproofing system",
    description: "Double-ply elastomeric membrane across flat slabs.",
    iconName: "ShieldCheck",
  },
  {
    id: "cs-5",
    title: "Solar-ready roof",
    description: "Integrated power conduits for full localized microgrid.",
    iconName: "Sun",
  },
]

export const idealForList: IdealItem[] = [
  {
    id: "if-1",
    title: "Family homes",
    description: "Flexible room separations and immense indoor activity flow.",
    iconName: "Users",
  },
  {
    id: "if-2",
    title: "Retirement homes",
    description: "Single-storey completely step-free universal mobility.",
    iconName: "Heart",
  },
  {
    id: "if-3",
    title: "Vacation properties",
    description: "Low maintenance materials and seamless lock-and-leave features.",
    iconName: "Palmtree",
  },
  {
    id: "if-4",
    title: "Investment projects",
    description: "Strong asset retention via signature architectural form.",
    iconName: "TrendingUp",
  },
]

export const getIcon = (iconName: string) => {
  const iconMap = Icons as unknown as Record<string, LucideIcon>
  return iconMap[iconName] ?? Icons.Cog
}
