// Provides the shared shadcn card structure for grouped interface content.
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-[var(--marketing-border)] bg-white text-[#171722] shadow-[0_14px_35px_-28px_rgba(23,23,34,0.24)]", className)} data-slot="card" {...props} />
}
function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex items-start justify-between gap-4 p-5", className)} data-slot="card-header" {...props} />
}
function CardTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("text-base font-bold tracking-[-0.02em]", className)} data-slot="card-title" {...props} />
}
function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-xs text-muted-foreground", className)} data-slot="card-description" {...props} />
}
function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-5 pb-5", className)} data-slot="card-content" {...props} />
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle }
