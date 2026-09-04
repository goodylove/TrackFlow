// Provides shadcn dropdown menus for workspace and account actions.
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"

function DropdownMenu(props: MenuPrimitive.Root.Props) { return <MenuPrimitive.Root {...props} /> }
function DropdownMenuTrigger(props: MenuPrimitive.Trigger.Props) { return <MenuPrimitive.Trigger {...props} /> }
function DropdownMenuGroup(props: MenuPrimitive.Group.Props) { return <MenuPrimitive.Group {...props} /> }
function DropdownMenuContent({ align = "start", side = "bottom", sideOffset = 6, className, ...props }: MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, "align" | "side" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner align={align} className="z-50" side={side} sideOffset={sideOffset}>
        <MenuPrimitive.Popup className={cn("min-w-48 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95", className)} {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}
function DropdownMenuLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) { return <MenuPrimitive.GroupLabel className={cn("px-2.5 py-2 text-xs font-semibold text-muted-foreground", className)} {...props} /> }
function DropdownMenuItem({ className, ...props }: MenuPrimitive.Item.Props) { return <MenuPrimitive.Item className={cn("flex cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none focus:bg-muted data-disabled:opacity-50", className)} {...props} /> }
function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) { return <MenuPrimitive.Separator className={cn("my-1 h-px bg-border", className)} {...props} /> }

export { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger }
