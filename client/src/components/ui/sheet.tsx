// Provides the responsive shadcn drawer used by the mobile dashboard shell.
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Sheet(props: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root {...props} />;
}
function SheetContent({
  className,
  children,
  side = "left",
  ...props
}: SheetPrimitive.Popup.Props & { side?: "left" | "right" }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
      <SheetPrimitive.Popup
        className={cn(
          "fixed inset-y-0 z-50 flex w-[18rem] flex-col bg-card shadow-2xl transition-transform duration-300 data-[side=left]:left-0 data-[side=left]:data-ending-style:-translate-x-full data-[side=left]:data-starting-style:-translate-x-full data-[side=right]:right-0 data-[side=right]:data-ending-style:translate-x-full data-[side=right]:data-starting-style:translate-x-full",
          className,
        )}
        data-side={side}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          render={
            <Button
              className="absolute right-3 top-3"
              size="icon"
              variant="ghost"
            />
          }
        >
          <XIcon aria-hidden="true" size={18} />
          <span className="sr-only">Close navigation</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  );
}
function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title className={cn("font-bold", className)} {...props} />
  );
}
function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-5", className)} {...props} />;
}

export { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle };
