// Keeps workspace request states distinct from a legitimate empty workspace list.
import { ArrowClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function WorkspaceLoadingState() {
  return (
    <section
      aria-label="Loading workspaces"
      aria-live="polite"
      className="rounded-2xl border border-[var(--marketing-border)] bg-white p-5 sm:p-7"
      role="status"
    >
      <span className="sr-only">Loading your workspaces...</span>
      <div className="animate-pulse space-y-5" aria-hidden="true">
        <div className="h-3 w-28 rounded-full bg-muted" />
        <div className="h-9 w-52 rounded-lg bg-muted" />
        <div className="h-4 max-w-md rounded-full bg-muted/80" />
        <div className="grid gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-28 rounded-xl border border-[var(--marketing-border)] bg-muted/35"
              key={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type WorkspaceErrorStateProps = {
  message: string;
  onRetry: () => void;
  retrying: boolean;
};

export function WorkspaceErrorState({
  message,
  onRetry,
  retrying,
}: WorkspaceErrorStateProps) {
  return (
    <section
      aria-labelledby="workspace-error-title"
      className="flex min-h-[28rem] items-center justify-center rounded-2xl border border-[var(--marketing-border)] bg-white px-5 py-12 text-center"
    >
      <div className="flex max-w-sm flex-col items-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <WarningCircleIcon aria-hidden="true" size={24} weight="fill" />
        </span>
        <h1 className="mt-5 text-xl font-black tracking-[-0.03em]" id="workspace-error-title">
          We could not load your workspaces
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
        <Button
          className="mt-6 h-10 rounded-lg"
          disabled={retrying}
          onClick={onRetry}
          type="button"
          variant="outline"
        >
          <ArrowClockwiseIcon
            aria-hidden="true"
            className={retrying ? "animate-spin" : undefined}
            size={17}
            weight="bold"
          />
          {retrying ? "Trying again..." : "Try again"}
        </Button>
      </div>
    </section>
  );
}
