// Welcomes users who have not created their first workspace yet.
import { BuildingsIcon, PlusIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

type DashboardEmptyStateProps = {
  onAddWorkspace?: () => void;
};

export function DashboardEmptyState({
  onAddWorkspace,
}: DashboardEmptyStateProps) {
  return (
    <section
      aria-labelledby="workspace-empty-state-title"
      className="relative flex min-h-[34rem] overflow-hidden rounded-3xl border border-[var(--marketing-border)] bg-white px-5 py-16 text-center shadow-[0_18px_45px_-34px_rgba(23,23,34,0.3)] sm:px-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.14),transparent_68%)]" />
      <div className="relative m-auto flex max-w-md flex-col items-center">
        <div className="relative mb-6 flex size-28 items-center justify-center rounded-full bg-[var(--marketing-action-soft)]">
          <span className="absolute inset-3 rounded-full border border-[var(--marketing-action)]/15" />
          <span className="flex size-14 items-center justify-center rounded-2xl bg-[var(--marketing-action)] text-white shadow-[0_16px_30px_-16px_var(--marketing-accent-shadow)]">
            <BuildingsIcon aria-hidden="true" size={28} weight="fill" />
          </span>
        </div>
        <h1
          className="text-2xl font-black tracking-[-0.035em] text-foreground sm:text-3xl"
          id="workspace-empty-state-title"
        >
          Create your first workspace
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          Bring your team, issues, and priorities into one focused place to
          start moving work forward.
        </p>
        <Button
          className="mt-7  cursor-pointer rounded-lg bg-[var(--marketing-action)] px-5 hover:bg-[var(--marketing-action)]/90"
          // disabled={!onAddWorkspace}
          onClick={onAddWorkspace}
          type="button"
        >
          <PlusIcon aria-hidden="true" size={18} weight="bold" />
          Add workspace
        </Button>
      </div>
    </section>
  );
}
