// Presents server-backed workspace metadata without implying unsupported editing.
import {
  ArrowClockwiseIcon,
  BuildingsIcon,
  CalendarBlankIcon,
  FingerprintIcon,
  ShieldCheckIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WorkspaceDetails } from "@/feature/dashboard/services/workspace-service";
import type { DashboardWorkspace } from "@/feature/dashboard/types";

type WorkspaceDetailsCardProps = {
  details: WorkspaceDetails;
  role: DashboardWorkspace["role"];
};

const roleLabels: Record<DashboardWorkspace["role"], string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function WorkspaceDetailsCard({
  details,
  role,
}: WorkspaceDetailsCardProps) {
  return (
    <section
      aria-labelledby="workspace-profile-title"
      className="overflow-hidden rounded-2xl border border-[var(--marketing-border)] bg-white shadow-[0_16px_40px_-34px_rgba(23,23,34,0.35)]"
    >
      <div className="flex flex-col gap-5 border-b border-[var(--marketing-border)] px-5 py-6 sm:flex-row sm:items-center sm:px-7">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]">
          <BuildingsIcon aria-hidden="true" size={26} weight="fill" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className="truncate text-xl font-black tracking-[-0.03em]"
              id="workspace-profile-title"
            >
              {details.name}
            </h2>
            <Badge className="border-[var(--marketing-action)]/15 bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]">
              {roleLabels[role]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Workspace profile and membership information
          </p>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
        <div className="px-5 py-6 sm:px-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Description
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/80">
            {details.description?.trim() ||
              "No description has been added to this workspace."}
          </p>
        </div>

        <dl className="divide-y divide-[var(--marketing-border)] border-t border-[var(--marketing-border)] bg-muted/20 lg:border-l lg:border-t-0">
          <div className="flex gap-3 px-5 py-4 sm:px-6">
            <CalendarBlankIcon
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[var(--marketing-action)]"
              size={18}
            />
            <div>
              <dt className="text-xs font-bold text-muted-foreground">Created</dt>
              <dd className="mt-1 text-sm font-bold">{formatDate(details.createdAt)}</dd>
            </div>
          </div>
          <div className="flex gap-3 px-5 py-4 sm:px-6">
            <ArrowClockwiseIcon
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[var(--marketing-action)]"
              size={18}
            />
            <div>
              <dt className="text-xs font-bold text-muted-foreground">Last updated</dt>
              <dd className="mt-1 text-sm font-bold">{formatDate(details.updatedAt)}</dd>
            </div>
          </div>
          <div className="flex gap-3 px-5 py-4 sm:px-6">
            <ShieldCheckIcon
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[var(--marketing-action)]"
              size={18}
            />
            <div>
              <dt className="text-xs font-bold text-muted-foreground">Your access</dt>
              <dd className="mt-1 text-sm font-bold">{roleLabels[role]}</dd>
            </div>
          </div>
          <div className="flex gap-3 px-5 py-4 sm:px-6">
            <FingerprintIcon
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[var(--marketing-action)]"
              size={18}
            />
            <div className="min-w-0">
              <dt className="text-xs font-bold text-muted-foreground">Workspace ID</dt>
              <dd className="mt-1 truncate font-mono text-xs text-foreground/75" title={details._id}>
                {details._id}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function WorkspaceDetailsLoadingState() {
  return (
    <section
      aria-label="Loading workspace details"
      aria-live="polite"
      className="animate-pulse rounded-2xl border border-[var(--marketing-border)] bg-white p-6 sm:p-7"
      role="status"
    >
      <span className="sr-only">Loading workspace details...</span>
      <div aria-hidden="true" className="flex items-center gap-4">
        <div className="size-14 rounded-2xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 rounded-md bg-muted" />
          <div className="h-4 w-64 max-w-full rounded-md bg-muted/80" />
        </div>
      </div>
      <div aria-hidden="true" className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="h-32 rounded-xl bg-muted/45" />
        <div className="h-32 rounded-xl bg-muted/45" />
      </div>
    </section>
  );
}

type WorkspaceDetailsErrorStateProps = {
  message: string;
  onRetry: () => void;
  retrying: boolean;
};

export function WorkspaceDetailsErrorState({
  message,
  onRetry,
  retrying,
}: WorkspaceDetailsErrorStateProps) {
  return (
    <section
      aria-labelledby="workspace-details-error-title"
      className="flex min-h-80 items-center justify-center rounded-2xl border border-[var(--marketing-border)] bg-white px-5 py-10 text-center"
    >
      <div className="flex max-w-sm flex-col items-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <WarningCircleIcon aria-hidden="true" size={22} weight="fill" />
        </span>
        <h2 className="mt-4 text-lg font-black" id="workspace-details-error-title">
          Workspace details are unavailable
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
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
