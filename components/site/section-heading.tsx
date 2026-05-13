import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
  align?: "left" | "center"
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="luxury-eyebrow">{eyebrow}</p>
      <h2 className="luxury-title-sm mt-4 text-[#2B2B2B]">{title}</h2>
      <p className="luxury-copy mt-4 text-sm sm:text-base">{description}</p>
    </div>
  )
}
