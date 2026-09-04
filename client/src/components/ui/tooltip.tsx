// Provides accessible shadcn tooltips for compact icon-only controls.
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({ delay = 250, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />
}
function Tooltip(props: TooltipPrimitive.Root.Props) { return <TooltipPrimitive.Root {...props} /> }
function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) { return <TooltipPrimitive.Trigger {...props} /> }
function TooltipContent({ className, side = "right", sideOffset = 8, children, ...props }: TooltipPrimitive.Popup.Props & Pick<TooltipPrimitive.Positioner.Props, "side" | "sideOffset">) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner className="z-50" side={side} sideOffset={sideOffset}>
        <TooltipPrimitive.Popup className={cn("rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-lg data-open:animate-in data-open:fade-in-0", className)} {...props}>{children}</TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
