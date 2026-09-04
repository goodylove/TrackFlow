// Provides a source-local shadcn-style select built on Base UI.
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { Select as SelectPrimitive } from "@base-ui/react/select";

import { cn } from "@/lib/utils";

function Select<Value>(props: SelectPrimitive.Root.Props<Value, false>) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectValue(props: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 min-w-36 cursor-pointer items-center justify-between gap-2 rounded-lg border border-[var(--marketing-border-strong)] bg-white px-3 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-[var(--marketing-action)]/25 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <CaretDownIcon aria-hidden="true" size={14} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  align = "start",
  side = "bottom",
  sideOffset = 6,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "side" | "sideOffset"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={false}
        className="z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          className={cn(
            "min-w-[var(--anchor-width)] rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            className,
          )}
          {...props}
        >
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "flex cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none data-highlighted:bg-muted data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 items-center gap-2">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="text-[var(--marketing-action)]">
        <CheckIcon aria-hidden="true" size={15} weight="bold" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
