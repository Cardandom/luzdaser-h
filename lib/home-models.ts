export type HomeModelId = "oliver" | "luca" | "audrey"

export type HomeModelProjectSlug =
  | "oliver-boutique"
  | "luca-boutique"
  | "audrey"

export type HomeModel = {
  id: HomeModelId
  title: string
  projectSlug: HomeModelProjectSlug
  projectHref: `/projects/${HomeModelProjectSlug}`
}

export const homeModels = [
  {
    id: "oliver",
    title: "Oliver Villa",
    projectSlug: "oliver-boutique",
    projectHref: "/projects/oliver-boutique",
  },
  {
    id: "luca",
    title: "Luca Boutique House",
    projectSlug: "luca-boutique",
    projectHref: "/projects/luca-boutique",
  },
  {
    id: "audrey",
    title: "Audrey",
    projectSlug: "audrey",
    projectHref: "/projects/audrey",
  },
] as const satisfies readonly HomeModel[]

export function getHomeModelBySlug(projectSlug: HomeModelProjectSlug) {
  return homeModels.find((model) => model.projectSlug === projectSlug)
}
