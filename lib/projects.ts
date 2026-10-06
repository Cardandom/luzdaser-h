import {
  DoorOpen,
  House,
  Sprout,
  LayoutPanelTop,
  CookingPot,
  BedDouble,
  TreePine,
  Bath,
  AirVent,
  WavesLadder,
  BrickWall,
  PanelTopOpen,
  PlugZap,
  Building2,
  Grid2x2,
  Fence,
  DatabaseZap,
  ShieldCheck,
  ShieldCheckIcon,
  RockingChair,
  Gem,
  Beef,
  CarFront,
  Ruler,
  type LucideIcon,
} from "lucide-react"

export type ProjectSlug = "oliver" | "luca" | "audrey"

export type ProjectFeature = {
  icon: LucideIcon
  label: string
  description?: string
}

export type ProjectTile = {
  title: string
  picture: string
  alt: string
  objectPosition: string
  caption: string
}

export type ProjectBlueprintSheet = {
  picture: string
  sheetNumber: string
  title: string
  badge: string
  alt: string
}

export type Project = {
  slug: ProjectSlug
  title: string
  price: string
  picture: string
  objectPosition: string
  summary: string
  badge: string
  eyebrow: string
  boardTitle: string
  boardSubtitle: string
  intro: string
  comparisonFeatures: ProjectFeature[]
  comparisonNote?: string
  highlightsTitle?: string
  features: ProjectFeature[]
  highlights: ProjectFeature[]
  highlightsNote?: ProjectFeature
  blueprintSheets: ProjectBlueprintSheet[]
  tiles: ProjectTile[]
}

export const priceListNote =
  "Starting package prices from the August 27, 2026 price list, valid through December 2026 or while current phase availability lasts. Request current availability."

export const projects: Project[] = [
  {
    slug: "luca",
    title: "Luca",
    price: "From AWG 1,140,545",
    picture: "/lucaDetails.webp",
    objectPosition: "center center",
    summary:
      "A compact boutique residence with crisp lines, warm accents, and a private resort feel.",
    badge: "Luca",
    eyebrow: "Project dossier",
    boardTitle: "Luca",
    boardSubtitle: "Boutique Living in Central Aruba",
    intro:
      "Luca is designed as a calm, contemporary retreat with a clean frontage, intimate outdoor areas, and an easy indoor-outdoor rhythm.",
    comparisonFeatures: [
      { icon: House, label: "80 m² Home" },
      { icon: BedDouble, label: "2 Bedrooms" },
      { icon: Bath, label: "2 Bathrooms" },
      { icon: Ruler, label: "227 m² Lot" },
      { icon: WavesLadder, label: "Private Pool" },
    ],
    highlightsTitle: "Finishes and Comfort",
    features: [
      { icon: House, label: "80 m² House" },
      { icon: BedDouble, label: "Two Bedrooms" },
      { icon: Bath, label: "Two Bathrooms" },
      { icon: CookingPot, label: "Luxury Kitchen With Electricity" },
      { icon: Sprout, label: "Minimalist Design" },
      { icon: AirVent, label: "Air Conditioning" },
      { icon: WavesLadder, label: "Private Pool · Approx. 11–12 m²" },
      { icon: ShieldCheckIcon, label: "Quality" },
      { icon: RockingChair, label: "Confort" },
      { icon: Gem, label: "Exclusiveness" }
    ],
    highlights: [
      {
        icon: PanelTopOpen,
        label: "PVC Windows",
        description: "Double glazing, thermal and acoustic insulation, reinforced security.",
      },
      {
        icon: DoorOpen,
        label: "Quality Doors",
        description:
          "PVC security front door with multipoint lock and semi-solid interior doors with quality hardware.",
      },
      {
        icon: Grid2x2,
        label: "Quality Floors",
        description:
          "High-quality porcelain throughout the house and non-slip ceramic in bathrooms and showers.",
      },
      {
        icon: PlugZap,
        label: "Safe Electrical Installation",
        description:
          "NEN 1010 compliant system with panel up to 23 kVA (110V/220V) and TV points in living room and bedrooms.",
      },
      {
        icon: BrickWall,
        label: "Robust Structure",
        description:
          "Solid concrete block construction with columns and tie beams, and a wooden roof with waterproof asphalt membrane.",
      },
      {
        icon: Building2,
        label: "Urban Complex",
        description:
          "Urban development with a children's recreational park and sidewalks around the entire complex.",
      },
      {
        icon: Fence,
        label: "Perimeter Wall",
        description: "6-inch solid block wall around the lot, built 2 meters high.",
      },
      {
        icon: DatabaseZap,
        label: "Septic Tank",
        description: "Individual septic tank of 12 m³.",
      },
    ],
    highlightsNote: {
      icon: ShieldCheck,
      label: "Your investment, your peace of mind",
      description:
        "It includes legal documentation, permits, and all the necessary elements for complete peace of mind. It also includes infrastructure for electricity, water, and internet services (ELMAR, WEB, and SETAR).",
    },
    blueprintSheets: [
      {
        picture: "/projects/luca/luca-site-plan.webp",
        sheetNumber: "Sheet A-101",
        title: "Site Plan",
        badge: "Plan Documentation",
        alt: "Site plan for Luca",
      },
      {
        picture: "/projects/luca/luca-exploded-axonometric.webp",
        sheetNumber: "Sheet A-105",
        title: "Exploded Axonometric",
        badge: "3D Visualization",
        alt: "Exploded axonometric view of Luca",
      },
    ],
    tiles: [
      {
        title: "Front elevation",
        picture: "/frontHouse.webp",
        alt: "Front elevation of Luca",
        objectPosition: "center center",
        caption: "Refined minimalist finishes",
      },
      {
        title: "Living mood",
        picture: "/livingroom.webp",
        alt: "Living room interior for Luca",
        objectPosition: "center center",
        caption: "Light-filled interiors with a sense of tranquility",
      },
      {
        title: "Kitchen detail",
        picture: "/kitchen.webp",
        alt: "Kitchen interior for Luca",
        objectPosition: "center center",
        caption: "Crisp finishes and an easy view back to the living area.",
      },
      {
        title: "Outdoor scene",
        picture: "/sunset.webp",
        alt: "Outdoor sunset view for Luca",
        objectPosition: "center center",
        caption: "A vibrant Caribbean tropical ambiance",
      },
    ],
  },
  {
    slug: "oliver",
    title: "Oliver",
    price: "From AWG 1,804,539",
    picture: "/front3DOliver.webp",
    objectPosition: "center center",
    summary:
      "A more expansive villa composition with a softer palette, garden framing, and a relaxed outdoor rhythm.",
    badge: "Oliver",
    eyebrow: "Project dossier",
    boardTitle: "Oliver",
    boardSubtitle: "Private Villa Living in Central Aruba",
    intro:
      "Oliver balances privacy and openness with generous outdoor living and a calm interior atmosphere. Its 130 m² home can be configured with three or four bedrooms according to buyer preference, with three bathrooms, a private 18 m² pool, a terrace and a private garden.",
    comparisonFeatures: [
      { icon: House, label: "130 m² Home" },
      { icon: BedDouble, label: "3–4 Bedrooms" },
      { icon: Bath, label: "3 Bathrooms" },
      { icon: WavesLadder, label: "Private 18 m² Pool" },
      { icon: TreePine, label: "Private Garden" },
    ],
    comparisonNote:
      "3 or 4 bedroom configuration available depending on buyer preference.",
    features: [
      { icon: House, label: "130 m² House" },
      { icon: BedDouble, label: "Three or Four Bedrooms" },
      { icon: Bath, label: "Three bathrooms" },
      { icon: CookingPot, label: "Dual Luxury Kitchen" },
      { icon: Sprout, label: "Minimalist Design" },
      { icon: AirVent, label: "Air Conditioning" },
      { icon: WavesLadder, label: "18 m² Pool Area" },
      { icon: Beef, label: "BBQ Area"},
      { icon: ShieldCheckIcon, label: "Quality Finishes" },
      { icon: RockingChair, label: "Confort" },
      { icon: Gem, label: "Exclusiveness" }
    ],
    highlights: [
      {
        icon: PanelTopOpen,
        label: "PVC Windows",
        description: "Double glazing, thermal and acoustic insulation, reinforced security.",
      },
      {
        icon: DoorOpen,
        label: "Quality Doors",
        description:
          "PVC security front door with multipoint lock and semi-solid interior doors with quality hardware.",
      },
      {
        icon: Grid2x2,
        label: "Quality Floors",
        description:
          "High-quality porcelain throughout the house and non-slip ceramic in bathrooms and showers.",
      },
      {
        icon: PlugZap,
        label: "Safe Electrical Installation",
        description:
          "NEN 1010 compliant system with panel up to 23 kVA (110V/220V) and TV points in living room and bedrooms.",
      },
      {
        icon: BrickWall,
        label: "Robust Structure",
        description:
          "Solid concrete block construction with columns and tie beams, and a wooden roof with waterproof asphalt membrane.",
      },
      {
        icon: Building2,
        label: "Urban Complex",
        description:
          "Urban development with a children's recreational park and sidewalks around the entire complex.",
      },
      {
        icon: Fence,
        label: "Perimeter Wall",
        description: "6-inch solid block wall around the lot, built 2 meters high.",
      },
      {
        icon: DatabaseZap,
        label: "Septic Tank",
        description: "Individual septic tank of 12 m³.",
      },
    ],
    blueprintSheets: [
      {
        picture: "/projects/oliver/oliver-site-plan.webp",
        sheetNumber: "Sheet A-101",
        title: "Site Plan",
        badge: "Plan Documentation",
        alt: "Site plan for Oliver",
      },
      {
        picture: "/projects/oliver/oliver-exploded-axonometric.webp",
        sheetNumber: "Sheet A-105",
        title: "Exploded Axonometric",
        badge: "3D Visualization",
        alt: "Exploded axonometric view of Oliver",
      },
    ],
    tiles: [
      {
        title: "Arrival view",
        picture: "/front3DOliver.webp",
        alt: "Exterior evening view of Oliver",
        objectPosition: "center center",
        caption: "Soft lighting and a resort-style welcome.",
      },
      {
        title: "Terrace life",
        picture: "/projects/oliver/oliver-front-view-02.webp",
        alt: "Terrace and exterior view for Oliver",
        objectPosition: "center center",
        caption: "A broad terrace that opens the home to the garden.",
      },
      {
        title: "Interior calm",
        picture: "/livingroom.webp",
        alt: "Living room interior for Oliver",
        objectPosition: "center center",
        caption: "Neutral interiors that keep the focus on comfort.",
      },
      {
        title: "Residential setting",
        picture: "/newComplex.webp",
        alt: "Reina Sophia residential community in Paradera, central Aruba",
        objectPosition: "center center",
        caption: "Private community living in central Aruba.",
      },
    ],
  },
  {
    slug: "audrey",
    title: "Audrey",
    price: "From AWG 2,189,211",
    picture: "/projects/audrey/audrey-front-elevation.webp",
    objectPosition: "center center",
    summary:
      "A two-level villa with four bedrooms, three bathrooms, and a refined minimalist character.",
    badge: "Audrey",
    eyebrow: "Project dossier",
    boardTitle: "Audrey",
    boardSubtitle: "Two-Level Villa in Central Aruba",
    intro:
      "Audrey is a two-level villa designed for generous family living, with four bedrooms, three bathrooms, a luxury kitchen with appliances, and a private 18 m² pool framed by landscaping.",
    comparisonFeatures: [
      { icon: House, label: "160 m² Home" },
      { icon: BedDouble, label: "4 Bedrooms" },
      { icon: Bath, label: "3 Bathrooms" },
      { icon: LayoutPanelTop, label: "Two Floors" },
      { icon: WavesLadder, label: "Private 18 m² Pool" },
    ],
    highlightsTitle: "Comfort and Quality",
    features: [
      { icon: House, label: "160 m² House" },
      { icon: LayoutPanelTop, label: "Two Floors" },
      { icon: BedDouble, label: "Four Bedrooms" },
      { icon: Bath, label: "Three Bathrooms" },
      { icon: Sprout, label: "Minimalist Design" },
      { icon: CookingPot, label: "Luxury Kitchen with Appliances" },
      { icon: AirVent, label: "Air-Conditioning" },
      { icon: WavesLadder, label: "18 m² Pool" },
      { icon: CarFront, label: "Two Parking Spaces" },
      { icon: Ruler, label: "12 m² Terrace" },
      { icon: TreePine, label: "Landscaping" },
    ],
    highlights: [
      {
        icon: CookingPot,
        label: "Equipped Kitchen",
        description:
          "A fully equipped kitchen with countertop, modern cabinets, and appliances included.",
      },
      {
        icon: DoorOpen,
        label: "Sliding Door",
        description:
          "Double-glazed sliding doors connect the interior with the pool area.",
      },
      {
        icon: Bath,
        label: "Luxury Bathrooms",
        description:
          "Porcelain finishes, durable faucets, and tempered-glass shower enclosures.",
      },
      {
        icon: PanelTopOpen,
        label: "PVC Windows",
        description:
          "Double glazing provides thermal and acoustic insulation with reinforced security.",
      },
      {
        icon: DoorOpen,
        label: "Quality Doors",
        description:
          "A multipoint-lock PVC entrance door and semi-solid interior doors with quality hardware.",
      },
      {
        icon: Grid2x2,
        label: "Quality Floors",
        description:
          "Porcelain flooring throughout, with non-slip ceramic in bathrooms and showers.",
      },
      {
        icon: PlugZap,
        label: "Safe Electrical Installation",
        description:
          "A NEN 1010 electrical system with 110V/220V service and TV points in living areas and bedrooms.",
      },
      {
        icon: BrickWall,
        label: "Robust Structure",
        description:
          "Solid concrete block construction with columns, tie beams, and a waterproofed wooden roof.",
      },
    ],
    blueprintSheets: [
      {
        picture: "/projects/audrey/audrey-site-plan.webp",
        sheetNumber: "Sheet A-101",
        title: "Site Plan",
        badge: "Plan Documentation",
        alt: "Ground and first floor site plan for Audrey",
      },
      {
        picture: "/projects/audrey/audrey-exploded-axonometric.webp",
        sheetNumber: "Sheet A-105",
        title: "Exploded Axonometric",
        badge: "3D Visualization",
        alt: "Exploded axonometric ground and first floor view of Audrey",
      },
    ],
    tiles: [
      {
        title: "Signature facade",
        picture: "/projects/audrey/audrey-front-elevation.webp",
        alt: "Front elevation of Audrey",
        objectPosition: "center center",
        caption: "Audrey's two-level minimalist profile.",
      },
      {
        title: "Community setting",
        picture: "/projects/audrey/audrey-community-streetscape.webp",
        alt: "Two-level Audrey residences along a landscaped residential street",
        objectPosition: "center center",
        caption: "Two-level villas arranged along a landscaped residential street.",
      },
      {
        title: "Evening arrival",
        picture: "/projects/audrey/audrey-evening-arrival.webp",
        alt: "Evening arrival view of Audrey",
        objectPosition: "center center",
        caption: "Warm exterior lighting defines the main approach.",
      },
      {
        title: "Villa collection",
        picture: "/projects/audrey/audrey-villa-collection.webp",
        alt: "Audrey residences presented as part of the residential community",
        objectPosition: "center center",
        caption: "Audrey residences within the wider private community.",
      },
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
