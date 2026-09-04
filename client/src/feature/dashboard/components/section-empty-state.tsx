// Provides a consistent compact empty state for dashboard data sections.
import type { Icon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

type SectionEmptyStateProps = {
  className?: string;
  description: string;
  icon: Icon;
  title: string;
};

export function SectionEmptyState({
  className,
  description,
  icon: EmptyIcon,
  title,
}: SectionEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--marketing-border)] bg-muted/20 px-5 py-8 text-center",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]">
        <EmptyIcon aria-hidden="true" size={21} weight="duotone" />
      </span>
      <h3 className="mt-4 text-sm font-bold text-foreground">{title}</h3>
      <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
