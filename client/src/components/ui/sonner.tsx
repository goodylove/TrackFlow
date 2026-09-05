// Provides the application-wide Sonner notification surface.
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return <SonnerToaster position="top-center" {...props} />;
}
