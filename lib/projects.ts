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

export type ProjectSlug = "luca-boutique" | "oliver-boutique" | "audrey"

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
  price?: string
  picture: string
  objectPosition: string
  summary: string
  badge: string
  eyebrow: string
  boardTitle: string
  boardSubtitle: string
  intro: string
  highlightsTitle?: string
  features: ProjectFeature[]
  highlights: ProjectFeature[]
  highlightsNote?: ProjectFeature
  blueprintSheets: ProjectBlueprintSheet[]
  tiles: ProjectTile[]
}

export const projects: Project[] = [
  {
    slug: "luca-boutique",
    title: "Luca Boutique House",
    price: "$280,000 USD",
    picture: "/lucaDetails.webp",
    objectPosition: "center center",
    summary:
      "A compact boutique residence with crisp lines, warm accents, and a private resort feel.",
    badge: "luca boutique house",
    eyebrow: "Project dossier",
    boardTitle: "Luca Boutique House",
    boardSubtitle: "Living by the sea",
    intro:
      "Luca Boutique House is designed as a calm, contemporary retreat with a clean frontage, intimate outdoor areas, and an easy indoor-outdoor rhythm.",
    highlightsTitle: "Finishes and Comfort",
    features: [
      { icon: House, label: "80 m² House" },
      { icon: BedDouble, label: "Two Bedrooms" },
      { icon: Bath, label: "Two Bathrooms" },
      { icon: CookingPot, label: "Luxury Kitchen With Electricity" },
      { icon: Sprout, label: "Minimalist Design" },
      { icon: AirVent, label: "Air Conditioning" },
      { icon: WavesLadder, label: "11 m² Pool Area" },
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
        alt: "Site plan for Luca Boutique House",
      },
      {
        picture: "/projects/luca/luca-exploded-axonometric.webp",
        sheetNumber: "Sheet A-105",
        title: "Exploded Axonometric",
        badge: "3D Visualization",
        alt: "Exploded axonometric view of Luca Boutique House",
      },
    ],
    tiles: [
      {
        title: "Front elevation",
        picture: "/frontHouse.webp",
        alt: "Front elevation of Luca Boutique House",
        objectPosition: "center center",
        caption: "Refined minimalist finishes",
      },
      {
        title: "Living mood",
        picture: "/livingroom.webp",
        alt: "Living room interior for Luca Boutique House",
        objectPosition: "center center",
        caption: "Light-filled interiors with a sense of tranquility",
      },
      {
        title: "Kitchen detail",
        picture: "/kitchen.webp",
        alt: "Kitchen interior for Luca Boutique House",
        objectPosition: "center center",
        caption: "Crisp finishes and an easy view back to the living area.",
      },
      {
        title: "Outdoor scene",
        picture: "/sunset.webp",
        alt: "Outdoor sunset view for Luca Boutique House",
        objectPosition: "center center",
        caption: "A vibrant Caribbean tropical ambiance",
      },
    ],
  },
  {
    slug: "oliver-boutique",
    title: "Oliver Villa",
    price: "$350,000 USD",
    picture: "/OliverHouse.webp",
    objectPosition: "center center",
    summary:
      "A more expansive villa composition with a softer palette, garden framing, and a relaxed outdoor rhythm.",
    badge: "Villa collection",
    eyebrow: "Project dossier",
    boardTitle: "Oliver Villa",
    boardSubtitle: "Living by the sea",
    intro:
      "Oliver Villa balances privacy and openness with generous outdoor living, a calm interior atmosphere, and a design that feels quietly refined throughout the day.",
    features: [
      { icon: House, label: "130 m² House" },
      { icon: BedDouble, label: "Three Bedrooms" },
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
        alt: "Site plan for Oliver Villa",
      },
      {
        picture: "/projects/oliver/oliver-exploded-axonometric.webp",
        sheetNumber: "Sheet A-105",
        title: "Exploded Axonometric",
        badge: "3D Visualization",
        alt: "Exploded axonometric view of Oliver Villa",
      },
    ],
    tiles: [
      {
        title: "Arrival view",
        picture: "/OliverHouse.webp",
        alt: "Exterior evening view of Oliver Villa",
        objectPosition: "center center",
        caption: "Soft lighting and a resort-style welcome.",
      },
      {
        title: "Terrace life",
        picture: "/frontHouse1.webp",
        alt: "Terrace and exterior view for Oliver Villa",
        objectPosition: "center center",
        caption: "A broad terrace that opens the home to the garden.",
      },
      {
        title: "Interior calm",
        picture: "/livingroom.webp",
        alt: "Living room interior for Oliver Villa",
        objectPosition: "center center",
        caption: "Neutral interiors that keep the focus on comfort.",
      },
      {
        title: "Beach mood",
        picture: "/beachView.webp",
        alt: "Beach view mood image for Oliver Villa",
        objectPosition: "center center",
        caption: "A coastal note that reinforces the Aruba lifestyle.",
      },
    ],
  },
  {
    slug: "audrey",
    title: "Audrey Villa Model",
    picture: "/projects/audrey/audrey-front-elevation.webp",
    objectPosition: "center center",
    summary:
      "A two-level villa with four bedrooms, three bathrooms, and a refined minimalist character.",
    badge: "Audrey Villa Model",
    eyebrow: "Project dossier",
    boardTitle: "Audrey Villa Model",
    boardSubtitle: "Elegance and exclusivity",
    intro:
      "Audrey is a two-level villa designed for generous family living, with four bedrooms, three bathrooms, a luxury kitchen with appliances, and a private 18 m² pool framed by landscaping.",
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
        alt: "Ground and first floor site plan for Audrey Villa Model",
      },
      {
        picture: "/projects/audrey/audrey-exploded-axonometric.webp",
        sheetNumber: "Sheet A-105",
        title: "Exploded Axonometric",
        badge: "3D Visualization",
        alt: "Exploded axonometric ground and first floor view of Audrey Villa Model",
      },
    ],
    tiles: [
      {
        title: "Signature facade",
        picture: "/projects/audrey/audrey-front-elevation.webp",
        alt: "Front elevation of Audrey Villa Model",
        objectPosition: "center center",
        caption: "Audrey's two-level minimalist profile.",
      },
      {
        title: "Community setting",
        picture: "/projects/audrey/audrey-community-streetscape.webp",
        alt: "Two-level Audrey villas along a landscaped residential street",
        objectPosition: "center center",
        caption: "Two-level villas arranged along a landscaped residential street.",
      },
      {
        title: "Evening arrival",
        picture: "/projects/audrey/audrey-evening-arrival.webp",
        alt: "Evening arrival view of Audrey Villa Model",
        objectPosition: "center center",
        caption: "Warm exterior lighting defines the main approach.",
      },
      {
        title: "Villa collection",
        picture: "/projects/audrey/audrey-villa-collection.webp",
        alt: "Audrey villas presented as part of the residential community",
        objectPosition: "center center",
        caption: "Audrey residences within the wider private community.",
      },
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
