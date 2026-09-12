import * as Icons from "lucide-react"
import type { LucideIcon } from "lucide-react"

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
    title: "PVC double glazing",
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
