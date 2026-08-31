import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center cursor-pointer justify-center gap-2 whitespace-nowrap border border-transparent text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--marketing-accent)]/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:bg-[var(--marketing-primary-strong)]",
        outline:
          "border-[var(--marketing-border-strong)] bg-white/80 text-[var(--foreground)] hover:bg-white",
        ghost:
          "bg-transparent text-[var(--foreground)] hover:bg-black/5",
        link: "bg-transparent px-0 text-[var(--foreground)] hover:text-[var(--primary)]",
      },
      size: {
        default: "h-11 rounded-md px-5",
        sm: "h-10 rounded-md px-4 text-sm",
        lg: "h-12 rounded-md px-6 text-base",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
