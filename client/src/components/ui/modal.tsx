// Provides a shared controlled modal shell for feature-specific content.
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalProps = {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  icon?: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  preventClose?: boolean;
  title?: ReactNode;
};

function Modal({
  children,
  className,
  description,
  icon,
  onOpenChange,
  open,
  preventClose = false,
  title,
}: ModalProps) {
  return (
    <DialogPrimitive.Root
      disablePointerDismissal={preventClose}
      onOpenChange={(nextOpen) => {
        if (!preventClose) onOpenChange(nextOpen);
      }}
      open={open}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-[#171722]/35 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-[var(--marketing-border)] bg-white shadow-[0_28px_80px_-24px_rgba(23,23,34,0.4)] outline-none transition duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className,
          )}
        >
          <header className="relative flex min-h-24 items-center gap-3 border-b border-[var(--marketing-border)] bg-[var(--marketing-bg)]/55 px-5 py-5 sm:px-6">
            {icon ? (
              <span className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-[var(--marketing-action)]/15 bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]">
                {icon}
              </span>
            ) : null}
            <div className="relative min-w-0 flex-1">
              <DialogPrimitive.Title className="text-lg font-black tracking-[-0.025em] text-foreground">
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-1 text-xs leading-5 text-muted-foreground">
                {description}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              aria-label="Close modal"
              disabled={preventClose}
              render={
                <Button
                  className="relative size-10 rounded-xl border border-border bg-white text-muted-foreground shadow-sm"
                  size="icon"
                  type="button"
                  variant="ghost"
                />
              }
            >
              <XIcon aria-hidden="true" size={16} />
            </DialogPrimitive.Close>
          </header>
          <div className="min-h-0 overflow-y-auto">{children}</div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { Modal };
