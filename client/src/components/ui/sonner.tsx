// Provides the application-wide Sonner notification surface.
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border-[var(--marketing-border)] !bg-white !text-foreground !shadow-[0_20px_50px_-24px_rgba(23,23,34,0.38)]",
          title: "!text-sm !font-bold",
          description: "!text-xs !text-muted-foreground",
          closeButton:
            "!border-[var(--marketing-border)] !bg-white !text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}
