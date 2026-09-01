

import { boardCards, boardColumns, featureTags, workspaces } from "@/constants/dummy";
import {
  CalendarBlank,
  ChatsCircle,
  CheckCircle,
  DotsThree,
  Kanban,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react";



function getPriorityClass(priority: string) {
  switch (priority) {
    case "Low":
      return "text-slate-500";

    case "Medium":
      return "text-amber-600";

    case "High":
      return "text-red-600";

    default:
      return "text-red-800";
  }
}

export function ProductPreview() {
  return (
    <div className="relative mt-14 w-full">
      <div className="absolute inset-x-[10%] top-10 h-16 rounded-full bg-[var(--marketing-side-glow-soft)] blur-3xl" />

      <div className="mx-auto max-w-[var(--preview-width)]">
        <div className="overflow-hidden rounded-[1.70rem] border border-[var(--marketing-preview-border)] bg-[var(--marketing-elevated)] shadow-[0_30px_90px_-45px_rgba(22,32,25,0.18)]">
          <div className="flex items-center gap-3 border-b border-[var(--marketing-border)] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#ff5f57]" />
              <span className="size-2 rounded-full bg-[#febc2e]" />
              <span className="size-2 rounded-full bg-[#28c840]" />
            </div>

            <div className="flex flex-1 justify-center">
              <div className="flex  w-full  max-w-[26rem] items-center justify-center truncate rounded-[var(--radius-pill)] border border-[var(--marketing-border)] bg-[var(--marketing-page)] px-4 py-1.5 text-[0.72rem] text-[var(--marketing-muted-foreground)]">
                trackflow.app/workspaces/trackflow-development/issues
              </div>
            </div>

            <div className="hidden items-center gap-3 text-[var(--marketing-muted-foreground)] sm:flex">
              <MagnifyingGlass className="size-4" />
              <DotsThree className="size-4" weight="bold" />
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <aside className="border-b border-[var(--marketing-border)] bg-[var(--marketing-preview-sidebar)] px-3 py-4 lg:border-r lg:border-b-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="flex size-8 items-center justify-center rounded-[0.9rem] bg-[var(--foreground)] text-white">
                    <Kanban className="size-4" weight="fill" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      Workspaces
                    </p>

                    <p className="text-xs text-[var(--marketing-muted-foreground)]">
                      Your team workspaces
                    </p>
                  </div>
                </div>

                <div className="rounded-[1rem] border border-[var(--marketing-border)] bg-white px-3 py-2.5 text-sm text-[var(--marketing-muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <MagnifyingGlass className="size-4" />
                    <span>Search workspaces</span>
                  </div>
                </div>

                <div className="rounded-[1rem] border border-[var(--marketing-border)] bg-white p-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--marketing-muted-foreground)]">
                    Your workspaces
                  </p>

                  <div className="mt-3 space-y-2">
                    {workspaces.map((workspace, index) => (
                      <div
                        key={workspace}
                        className={`rounded-[0.9rem] px-2 py-2 text-sm ${index === 0
                          ? "bg-[var(--marketing-track)] font-medium text-[var(--foreground)]"
                          : "text-[var(--marketing-muted-foreground)]"
                          }`}
                      >
                        {workspace}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="bg-white">
              <div className="border-b border-[var(--marketing-border)] px-4 py-4 sm:px-6">
                <p className="text-[0.7rem] text-[var(--marketing-muted-foreground)]">
                  Workspaces / TrackFlow Development / Issues
                </p>

                <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[2rem]">
                      TrackFlow Development
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--marketing-muted-foreground)] sm:text-sm">
                      <span>24 issues · 5 members</span>

                      <div className="flex -space-x-2">
                        {["G", "A", "T", "M"].map((letter) => (
                          <span
                            key={letter}
                            className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[var(--marketing-track)] text-[0.7rem] font-semibold text-[var(--foreground)]"
                          >
                            {letter}
                          </span>
                        ))}
                      </div>

                      <button
                        className="rounded-[var(--radius-pill)] border border-[var(--marketing-border)] px-3 py-1.5 font-medium text-[var(--foreground)]"
                        type="button"
                      >
                        Add member
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)]"
                      type="button"
                    >
                      <Plus className="size-4" />
                      New issue
                    </button>

                    <button
                      aria-label="More workspace actions"
                      className="rounded-[var(--radius-pill)] border border-[var(--marketing-border)] p-2 text-[var(--foreground)]"
                      type="button"
                    >
                      <DotsThree className="size-4" weight="bold" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-b border-[var(--marketing-border)] px-4 py-3 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-5 text-sm">
                    <span className="text-[var(--marketing-muted-foreground)]">
                      Overview
                    </span>

                    <span className="font-semibold text-[var(--foreground)]">
                      Issues
                    </span>

                    <span className="text-[var(--marketing-muted-foreground)]">
                      Members
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[var(--marketing-muted-foreground)]">
                    <span>Search</span>
                    <span>Status</span>
                    <span>Priority</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-3 sm:grid-cols-3 sm:p-4">
                {boardColumns.map((column, index) => {
                  const issue = boardCards[index];

                  return (
                    <div
                      key={column.name}
                      className="rounded-[1.1rem] border border-[var(--marketing-border)] bg-[var(--marketing-preview-column)] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[var(--foreground)]">
                            {column.name}
                          </span>

                          <span className="rounded-full bg-white px-2 py-0.5 text-[0.7rem] text-[var(--marketing-muted-foreground)]">
                            {column.count}
                          </span>
                        </div>

                        <DotsThree
                          className="size-4 text-[var(--marketing-muted-foreground)]"
                          weight="bold"
                        />
                      </div>

                      <div className="mt-3 rounded-[0.95rem] border border-dashed border-[var(--marketing-border)] bg-white/90 px-3 py-2 text-center text-sm text-[var(--marketing-muted-foreground)]">
                        Add issue
                      </div>

                      <article className="mt-3 rounded-[1rem] border border-[var(--marketing-border)] bg-white p-3 shadow-sm">
                        <div
                          className={`h-1 rounded-full ${column.accent}`}
                        />

                        <div className="mt-3 flex items-center justify-between text-[0.68rem] text-[var(--marketing-muted-foreground)]">
                          <span
                            className={getPriorityClass(issue.priority)}
                          >
                            {issue.priority}
                          </span>

                          <span>{issue.dueDate}</span>
                        </div>

                        <h3 className="mt-3 text-sm leading-6 font-medium text-[var(--foreground)]">
                          {issue.title}
                        </h3>

                        <div className="mt-4 flex items-center justify-between text-[var(--marketing-muted-foreground)]">
                          <div className="flex items-center gap-2 text-xs">
                            <ChatsCircle className="size-4" />
                            <span>{issue.comments}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <CalendarBlank className="size-4" />
                            <span>{issue.dueDate}</span>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-[42rem] flex-wrap items-center justify-center gap-3">
          {featureTags.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--marketing-border)] bg-white/92 px-4 py-2.5 text-sm text-[var(--foreground)] shadow-sm"
            >
              <CheckCircle
                className="size-4 text-[var(--primary)]"
                weight="duotone"
              />

              <span>{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}