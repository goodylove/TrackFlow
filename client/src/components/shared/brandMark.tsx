import { KanbanIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
    return (
        <div className={cn("flex size-7 items-center justify-center rounded-[0.55rem] bg-[var(--marketing-action)]/95 shadow-[0_10px_24px_-16px_rgba(47,55,244,0.75)]", className)}>
            <KanbanIcon className="size-4 text-white" weight="fill" />
        </div>
    )
}
