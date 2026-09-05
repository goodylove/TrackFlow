// Provides the application-wide Sonner notification surface.
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      closeButton
      duration={4000}
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border-[var(--marketing-action)]/25 !bg-[var(--marketing-action-soft)] !text-foreground ",
          title: "!text-sm !font-bold !text-[var(--marketing-action)]",
          description: "!text-xs !text-foreground/70",
          icon: "!text-[var(--marketing-action)]",
          closeButton:
            "!border-[var(--marketing-action)]/20 !bg-white !text-[var(--marketing-action)] hover:!bg-[var(--marketing-action-soft)]",
        },
      }}
      {...props}
    />
  );
}
