import { cn } from "@/lib/utils"

export function CornerGrid({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute grid grid-cols-2 gap-1 opacity-70 z-0", className)}>
      {Array.from({ length: 6 }).map((_, index) => <span key={index} className="size-9 rounded-[0.35rem] border border-[#d7d9f2]" />)}
    </div>
  )
}
