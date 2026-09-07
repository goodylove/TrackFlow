import { ArrowClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function DashboardDataLoadingState() {
  return (
    <section aria-label="Loading dashboard" aria-live="polite" role="status">
      <span className="sr-only">Loading workspace dashboard...</span>
      <div className="animate-pulse space-y-5" aria-hidden="true">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded-full bg-muted" />
          <div className="h-10 w-64 max-w-full rounded-lg bg-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-28 rounded-xl border border-[var(--marketing-border)] bg-white"
              key={index}
            />
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.8fr)]">
          <div className="h-[22rem] rounded-xl border border-[var(--marketing-border)] bg-white" />
          <div className="h-[22rem] rounded-xl border border-[var(--marketing-border)] bg-white" />
        </div>
      </div>
    </section>
  );
}

type DashboardDataErrorStateProps = {
  message: string;
  onRetry: () => void;
  retrying: boolean;
};

export function DashboardDataErrorState({
  message,
  onRetry,
  retrying,
}: DashboardDataErrorStateProps) {
  return (
    <section
      aria-labelledby="dashboard-error-title"
      className="flex min-h-[28rem] items-center justify-center rounded-2xl border border-[var(--marketing-border)] bg-white px-5 py-12 text-center"
    >
      <div className="flex max-w-sm flex-col items-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <WarningCircleIcon aria-hidden="true" size={24} weight="fill" />
        </span>
        <h1
          className="mt-5 text-xl font-black tracking-[-0.03em]"
          id="dashboard-error-title"
        >
          We could not load this dashboard
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {message}
        </p>
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
