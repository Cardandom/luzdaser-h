export type HomeModelId = "oliver" | "luca" | "audrey"

export type HomeModelProjectSlug = HomeModelId

export type HomeModel = {
  id: HomeModelId
  title: string
  projectSlug: HomeModelProjectSlug
  projectHref: `/projects/${HomeModelProjectSlug}`
}

export const homeModels = [
  {
    id: "oliver",
    title: "Oliver",
    projectSlug: "oliver",
    projectHref: "/projects/oliver",
  },
  {
    id: "luca",
    title: "Luca",
    projectSlug: "luca",
    projectHref: "/projects/luca",
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
