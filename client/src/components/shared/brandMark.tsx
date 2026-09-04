import { KanbanIcon } from "@phosphor-icons/react";

export function BrandMark() {
    return (
        <div className="flex size-7 items-center justify-center rounded-[0.55rem] bg-[var(--marketing-action)] shadow-[0_10px_24px_-16px_rgba(47,55,244,0.75)]">
            <KanbanIcon className="size-4 text-white" weight="fill" />
        </div>
    )
}