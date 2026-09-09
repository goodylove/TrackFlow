import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva("relative w-full rounded-md border px-3 py-2.5 text-sm leading-5", {
  variants: {
    variant: {
      default: "border-border bg-background text-foreground",
      destructive: "border-red-200 bg-red-50 text-red-700",
      success: "border-[var(--status-success-border)] bg-[var(--status-success-soft)] text-[var(--status-success)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Alert, alertVariants }
