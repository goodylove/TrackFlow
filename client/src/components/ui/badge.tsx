// Provides compact shadcn status labels with reusable visual variants.
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-bold leading-none", {
  variants: {
    variant: {
      default: "border-primary/10 bg-primary text-primary-foreground",
      secondary: "border-border bg-secondary text-secondary-foreground",
      outline: "border-border bg-background text-foreground",
      destructive: "border-destructive/15 bg-destructive/10 text-destructive",
    },
  },
  defaultVariants: { variant: "default" },
})

function Badge({ className, variant, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} data-slot="badge" {...props} />
}

export { Badge, badgeVariants }
