"use client"

import type { ComponentPropsWithoutRef } from "react"

import { navigateToHomeModel } from "@/lib/home-model-navigation"
import type { HomeModelId } from "@/lib/home-models"

type HomeModelLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "href"
> & {
  href?: string
  modelId: HomeModelId
}

export function HomeModelLink({
  children,
  className,
  href,
  modelId,
  onClick,
  ...anchorProps
}: HomeModelLinkProps) {
  const modelHref = href ?? `#${modelId}`

  return (
    <a
      {...anchorProps}
      href={modelHref}
      className={className}
      onClick={(event) => {
        onClick?.(event)
        navigateToHomeModel(event, modelId)
      }}
    >
      {children}
    </a>
  )
}
