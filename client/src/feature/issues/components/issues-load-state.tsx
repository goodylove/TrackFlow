import { ArrowClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function IssuesLoadingState() {
  return (
    <section aria-label="Loading workspace issues" aria-live="polite">
      <span className="sr-only">Loading workspace issues...</span>
      <div
        aria-hidden="true"
        className="grid auto-cols-[minmax(17.5rem,86vw)] grid-flow-col items-start gap-4 overflow-hidden xl:auto-cols-auto xl:grid-flow-row xl:grid-cols-3"
      >
        {Array.from({ length: 3 }).map((_, columnIndex) => (
          <div
            className="min-h-[28rem] animate-pulse rounded-2xl border border-[var(--marketing-border)] bg-[#f1f2f6] p-3"
            key={columnIndex}
          >
            <div className="flex items-center justify-between px-1 py-1">
              <div className="h-5 w-28 rounded bg-slate-200" />
              <div className="size-7 rounded-full bg-white" />
            </div>
            <div className="mt-4 space-y-3">
              {Array.from({ length: 2 }).map((_, cardIndex) => (
                <div
                  className="h-40 rounded-xl border border-white bg-white/75"
                  key={cardIndex}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type IssuesErrorStateProps = {
  message: string;
  onRetry: () => void;
  retrying: boolean;
};

export function IssuesErrorState({
  message,
  onRetry,
  retrying,
}: IssuesErrorStateProps) {
  return (
    <section
      aria-labelledby="issues-error-title"
      className="flex min-h-80 items-center justify-center rounded-2xl border border-[var(--marketing-border)] bg-white px-5 py-10 text-center"
    >
      <div className="flex max-w-sm flex-col items-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <WarningCircleIcon aria-hidden="true" size={22} weight="fill" />
        </span>
        <h2 className="mt-4 text-lg font-black" id="issues-error-title">
          Issues are unavailable
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {message}
        </p>
        <Button
          className="mt-5 h-10 rounded-lg"
          disabled={retrying}
          onClick={onRetry}
          type="button"
          variant="outline"
        >
          <ArrowClockwiseIcon
            aria-hidden="true"
            className={retrying ? "animate-spin" : undefined}
            size={17}
          />
          {retrying ? "Trying again..." : "Try again"}
        </Button>
      </div>
    </section>
  );
}
