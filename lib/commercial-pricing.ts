export type ResidenceSlug = "luca" | "oliver" | "audrey"
export type KitchenChoice = "none" | "standardKitchen" | "fullKitchen"
export type UpgradeSelection = {
  pool: boolean
  kitchen: KitchenChoice
  appliances: boolean
  terrace: boolean
  closets: boolean
}

export const landPricePerSquareMeter = 873
export const commercialPricing = {
  luca: { name: "Luca", baseHouse: 834031, startingPackage: 1032202, pool: 42350, standardKitchen: 40000, fullKitchen: 62640, appliances: 12000, terrace: 20000, closets: 18000 },
  oliver: { name: "Oliver", baseHouse: 1140031, startingPackage: 1463914, pool: 50000, standardKitchen: 40000, fullKitchen: 62640, appliances: 12000, terrace: 20000, closets: 27000 },
  audrey: { name: "Audrey", baseHouse: 1325850, startingPackage: 1650606, pool: 50000, standardKitchen: 40000, fullKitchen: 62640, appliances: 12000, terrace: 20000, closets: 36000 },
} as const

export const emptyUpgrades: UpgradeSelection = { pool: false, kitchen: "none", appliances: false, terrace: false, closets: false }
export const formatAwg = (amount: number) => `AWG ${amount.toLocaleString("en-US")}`

export function getConfiguration(slug: ResidenceSlug, selection: UpgradeSelection) {
  const pricing = commercialPricing[slug]
  const upgrades: { label: string; price: number }[] = []
  if (selection.pool) upgrades.push({ label: "Private Pool", price: pricing.pool })
  if (selection.kitchen === "standardKitchen") upgrades.push({ label: "Standard Kitchen", price: pricing.standardKitchen })
  if (selection.kitchen === "fullKitchen") upgrades.push({ label: "Full Integrated Kitchen", price: pricing.fullKitchen })
  if (selection.appliances && selection.kitchen !== "fullKitchen") upgrades.push({ label: "Appliance Set", price: pricing.appliances })
  if (selection.terrace) upgrades.push({ label: "Covered Terrace", price: pricing.terrace })
  if (selection.closets) upgrades.push({ label: "Custom Closets", price: pricing.closets })
  return { slug, residence: pricing.name, startingPackage: pricing.startingPackage, upgrades, total: upgrades.reduce<number>((sum, upgrade) => sum + upgrade.price, pricing.startingPackage) }
}
export type Configuration = ReturnType<typeof getConfiguration>
