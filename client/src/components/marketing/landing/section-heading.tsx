import { cn } from "@/lib/utils"

export function SectionHeading({ title, description, centered = true }: { title: string; description?: string; centered?: boolean }) {
  return (
    <div className={cn("max-w-[36rem]", centered && "mx-auto text-center")}>
      <h2 className="text-[2.1rem] font-black leading-[1.08] tracking-normal text-[#171722] sm:text-[2.65rem]">{title}</h2>
      {description ? <p className="mt-3 text-[0.95rem] leading-7 text-[var(--marketing-muted-foreground)]">{description}</p> : null}
    </div>
  )
}
