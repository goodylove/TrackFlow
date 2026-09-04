// Presents the first-action state for an empty workspace issue list.
import { ListPlusIcon, PlusIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

type IssuesEmptyStateProps = {
  onCreateIssue?: () => void;
};

export function IssuesEmptyState({ onCreateIssue }: IssuesEmptyStateProps) {
  return (
    <section
      aria-labelledby="issues-empty-state-title"
      className="flex min-h-[30rem] items-center justify-center rounded-2xl border border-[var(--marketing-border)] bg-white px-5 py-14 shadow-[0_14px_35px_-28px_rgba(23,23,34,0.24)] sm:px-8"
    >
      <div className="flex max-w-sm flex-col items-center text-center">
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-0 rounded-3xl border border-dashed border-[var(--marketing-action)]/25 bg-[var(--marketing-action-soft)]/45 rotate-6" />
          <span className="relative flex size-14 items-center justify-center rounded-2xl bg-white text-[var(--marketing-action)] shadow-[0_14px_30px_-18px_var(--marketing-accent-shadow)] ring-1 ring-[var(--marketing-action)]/12">
            <ListPlusIcon aria-hidden="true" size={27} weight="duotone" />
          </span>
        </div>
        <h2
          className="mt-6 text-xl font-black tracking-[-0.03em] text-foreground"
          id="issues-empty-state-title"
        >
          No issues to track yet
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Create your first issue to capture work, set its priority, and give
          your team a clear next step.
        </p>
        <Button
          className="mt-6 h-10 rounded-lg bg-[var(--marketing-action)] px-5 hover:bg-[var(--marketing-action)]/90"
          disabled={!onCreateIssue}
          onClick={onCreateIssue}
          type="button"
        >
          <PlusIcon aria-hidden="true" size={17} weight="bold" />
          Create first issue
        </Button>
      </div>
    </section>
  );
}
