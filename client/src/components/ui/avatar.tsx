// Provides the shared shadcn avatar primitive used for people across the app.
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: AvatarPrimitive.Root.Props) {
  return <AvatarPrimitive.Root className={cn("relative flex size-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted", className)} data-slot="avatar" {...props} />
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return <AvatarPrimitive.Image className={cn("size-full object-cover", className)} data-slot="avatar-image" {...props} />
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return <AvatarPrimitive.Fallback className={cn("flex size-full items-center justify-center bg-secondary text-xs font-bold text-secondary-foreground", className)} data-slot="avatar-fallback" {...props} />
}

export { Avatar, AvatarFallback, AvatarImage }
