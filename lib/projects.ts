import {
  Camera,
  DoorOpen,
  House,
  Sprout,
  LayoutPanelTop,
  Ruler,
  CookingPot,
  Sparkles,
  BedDouble,
  TreePine,
  Bath,
  AirVent,
  WavesLadder,
  Trees,
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
  type LucideIcon,
} from "lucide-react"

export type ProjectSlug = "lucas-boutique" | "oliver-boutique"

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

export type FeaturedProject = Pick<
  Project,
  "slug" | "title" | "price" | "picture" | "objectPosition"
>

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
  highlightsTitle?: string
  features: ProjectFeature[]
  highlights: ProjectFeature[]
  highlightsNote?: ProjectFeature
  tiles: ProjectTile[]
}

export const projects: Project[] = [
  {
    slug: "lucas-boutique",
    title: "Lucas Boutique House",
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
      "Lucas Boutique House is designed as a calm, contemporary retreat with a clean frontage, intimate outdoor areas, and an easy indoor-outdoor rhythm.",
    highlightsTitle: "Finishes and Comfort",
    features: [
      { icon: House, label: "80 m² House" },
      { icon: BedDouble, label: "Two Bedrooms" },
      { icon: Bath, label: "Two Bathrooms" },
      { icon: CookingPot, label: "Luxury Kitchen With Electricity" },
      { icon: Sprout, label: "Minimalist Design" },
      { icon: AirVent, label: "Air Conditioning" },
      { icon: WavesLadder, label: "12 m² Pool Area" },
      { icon: Trees, label: "Landscaping" },
      { icon: BrickWall, label: "Perimeter Walls" },
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
        label: "Reversed Floors",
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
        description: "Individual septic tank of 12 m2.",
      },
    ],
    highlightsNote: {
      icon: ShieldCheck,
      label: "Your investment, your peace of mind",
      description:
        "It includes legal documentation, permits, and all the necessary elements for complete peace of mind. It also includes infrastructure for electricity, water, and internet services (ELMAR, WEB, and SETAR).",
    },
    tiles: [
      {
        title: "Front elevation",
        picture: "/frontHouse.webp",
        alt: "Front elevation of Lucas Boutique House",
        objectPosition: "center center",
        caption: "Refined minimalist finishes",
      },
      {
        title: "Living mood",
        picture: "/livingroom.webp",
        alt: "Living room interior for Lucas Boutique House",
        objectPosition: "center center",
        caption: "Light-filled interiors with a sense of tranquility",
      },
      {
        title: "Kitchen detail",
        picture: "/kitchen.webp",
        alt: "Kitchen interior for Lucas Boutique House",
        objectPosition: "center center",
        caption: "Crisp finishes and an easy view back to the living area.",
      },
      {
        title: "Outdoor scene",
        picture: "/sunset.webp",
        alt: "Outdoor sunset view for Lucas Boutique House",
        objectPosition: "center center",
        caption: "A vibrant Caribbean tropical ambiance",
      },
    ],
  },
  {
    slug: "oliver-boutique",
    title: "Oliver Boutique",
    price: "$350,000 USD",
    picture: "/Oliver.webp",
    objectPosition: "center center",
    summary:
      "A more expansive villa composition with a softer palette, garden framing, and a relaxed outdoor rhythm.",
    badge: "Villa collection",
    eyebrow: "Project dossier",
    boardTitle: "Oliver Boutique House",
    boardSubtitle: "Living by the sea",
    intro:
      "Oliver Boutique balances privacy and openness with generous outdoor living, a calm interior atmosphere, and a design that feels quietly refined throughout the day.",
    features: [
      { icon: House, label: "Elegant family layout" },
      { icon: Sparkles, label: "Refined finishes" },
      { icon: Bath, label: "Outdoor lounge and pool" },
      { icon: CookingPot, label: "Quiet residential feel" },
      { icon: BedDouble, label: "Airy interior light" },
    ],
    highlights: [
      { icon: Camera, label: "Evening arrival composition" },
      { icon: LayoutPanelTop, label: "Wide indoor-outdoor transitions" },
      { icon: DoorOpen, label: "Protected entry court" },
      { icon: Ruler, label: "Balanced proportions" },
    ],
    tiles: [
      {
        title: "Arrival view",
        picture: "/Oliver.webp",
        alt: "Exterior evening view of Oliver Boutique",
        objectPosition: "center center",
        caption: "Soft lighting and a resort-style welcome.",
      },
      {
        title: "Terrace life",
        picture: "/frontHouse1.webp",
        alt: "Terrace and exterior view for Oliver Boutique",
        objectPosition: "center center",
        caption: "A broad terrace that opens the home to the garden.",
      },
      {
        title: "Interior calm",
        picture: "/livingroom.webp",
        alt: "Living room interior for Oliver Boutique",
        objectPosition: "center center",
        caption: "Neutral interiors that keep the focus on comfort.",
      },
      {
        title: "Beach mood",
        picture: "/beachView.webp",
        alt: "Beach view mood image for Oliver Boutique",
        objectPosition: "center center",
        caption: "A coastal note that reinforces the Aruba lifestyle.",
      },
    ],
  },
]

export const featuredProjects: FeaturedProject[] = projects.map(
  ({ slug, title, price, picture, objectPosition }) => ({
    slug,
    title,
    price,
    picture,
    objectPosition,
  }),
)

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
