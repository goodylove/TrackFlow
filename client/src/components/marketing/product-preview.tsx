import {
  CalendarBlank,
  ChatsCircle,
  CheckCircle,
  DotsThree,
  Kanban,
  MagnifyingGlass,
  ShareNetwork,
} from "@phosphor-icons/react"

const boardColumns = [
  { name: "To do", count: 12, accent: "bg-slate-300" },
  { name: "In progress", count: 8, accent: "bg-amber-300" },
  { name: "In review", count: 5, accent: "bg-orange-200" },
  { name: "Complete", count: 21, accent: "bg-emerald-400" },
]

const boardCards = [
  { title: "Refine issue activity timeline", label: "Low", due: "Jun 27" },
  { title: "Close auth edge case on invite flow", label: "Medium", due: "Jun 30" },
  { title: "Ship billing audit export filters", label: "High", due: "Jul 13" },
  { title: "Tighten dashboard empty states", label: "Urgent", due: "Jul 19" },
]

const featureTags = [
  "Issue Management",
  "Collaboration Tools",
  "Tasks & To Do's",
  "Project Management",
  "Goals & Strategy",
]

export function ProductPreview() {
  return (
    <div className="relative mt-14 w-full">
      <div className="absolute inset-x-[10%] top-10 h-16 rounded-full bg-[var(--marketing-side-glow-soft)] blur-3xl" />

      <div className="mx-auto max-w-[var(--preview-width)]">
        <div className="overflow-hidden rounded-[1.75rem] border border-[var(--marketing-preview-border)] bg-[var(--marketing-elevated)] shadow-[0_30px_90px_-45px_rgba(22,32,25,0.18)]">
          <div className="flex items-center gap-3 border-b border-[var(--marketing-border)] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#ff5f57]" />
              <span className="size-2 rounded-full bg-[#febc2e]" />
              <span className="size-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex flex-1 justify-center">
              <div className="flex min-w-[12rem] max-w-[24rem] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--marketing-border)] bg-[var(--marketing-page)] px-4 py-1.5 text-[0.72rem] text-[var(--marketing-muted-foreground)]">
                trackflow.app/projects
              </div>
            </div>
            <div className="hidden items-center gap-3 text-[var(--marketing-muted-foreground)] sm:flex">
              <ShareNetwork className="size-4" />
              <DotsThree className="size-4" weight="bold" />
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[11rem_minmax(0,1fr)]">
            <aside className="border-b border-[var(--marketing-border)] bg-[var(--marketing-preview-sidebar)] px-3 py-4 lg:border-r lg:border-b-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="flex size-8 items-center justify-center rounded-[0.9rem] bg-[var(--foreground)] text-white">
                    <Kanban className="size-4" weight="fill" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      All Projects
                    </p>
                    <p className="text-xs text-[var(--marketing-muted-foreground)]">
                      Product + platform
                    </p>
                  </div>
                </div>

                <div className="rounded-[1rem] border border-[var(--marketing-border)] bg-white px-3 py-2.5 text-sm text-[var(--marketing-muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <MagnifyingGlass className="size-4" />
                    <span>Search</span>
                  </div>
                </div>

                <div className="rounded-[1rem] border border-[var(--marketing-border)] bg-white p-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--marketing-muted-foreground)]">
                    Projects
                  </p>
                  <div className="mt-3 space-y-2">
                    {["Website rebuild", "Q3 launch", "Billing fixes", "Docs refresh"].map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-[0.9rem] px-2 py-2 text-sm ${index === 0 ? "bg-[var(--marketing-track)] font-medium text-[var(--foreground)]" : "text-[var(--marketing-muted-foreground)]"}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="bg-white">
              <div className="border-b border-[var(--marketing-border)] px-4 py-4 sm:px-6">
                <p className="text-[0.7rem] text-[var(--marketing-muted-foreground)]">
                  Projects / Timmy / SaaS Website
                </p>
                <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[2rem]">
                      TrackFlow Product Launch
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--marketing-muted-foreground)] sm:text-sm">
                      <span>Created on Jan 8, 2026</span>
                      <div className="flex -space-x-2">
                        {["A", "T", "M", "K"].map((letter) => (
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

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="rounded-[var(--radius-pill)] border border-[var(--marketing-border)] px-3 py-2 text-sm text-[var(--foreground)]"
                      type="button"
                    >
                      Private
                    </button>
                    <button
                      className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)]"
                      type="button"
                    >
                      <ShareNetwork className="size-4" />
                      Share
                    </button>
                    <button
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
                    <span className="font-semibold text-[var(--foreground)]">Board</span>
                    <span className="text-[var(--marketing-muted-foreground)]">Timeline</span>
                    <span className="text-[var(--marketing-muted-foreground)]">Calendar</span>
                    <span className="text-[var(--marketing-muted-foreground)]">List</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--marketing-muted-foreground)]">
                    <span>Sort</span>
                    <span>Filter</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-4">
                {boardColumns.map((column, index) => (
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
                      <DotsThree className="size-4 text-[var(--marketing-muted-foreground)]" weight="bold" />
                    </div>

                    <div className="mt-3 rounded-[0.95rem] border border-dashed border-[var(--marketing-border)] bg-white/90 px-3 py-2 text-center text-sm text-[var(--marketing-muted-foreground)]">
                      +
                    </div>

                    <article className="mt-3 rounded-[1rem] border border-[var(--marketing-border)] bg-white p-3 shadow-sm">
                      <div className={`h-1 rounded-full ${column.accent}`} />
                      <div className="mt-3 flex items-center justify-between text-[0.68rem] text-[var(--marketing-muted-foreground)]">
                        <span
                          className={
                            boardCards[index].label === "Low"
                              ? "text-slate-500"
                              : boardCards[index].label === "Medium"
                                ? "text-amber-600"
                                : boardCards[index].label === "High"
                                  ? "text-red-600"
                                  : "text-red-800"
                          }
                        >
                          {boardCards[index].label}
                        </span>
                        <span>{boardCards[index].due}</span>
                      </div>
                      <h3 className="mt-3 text-sm font-medium leading-6 text-[var(--foreground)]">
                        {boardCards[index].title}
                      </h3>
                      <div className="mt-4 flex items-center justify-between text-[var(--marketing-muted-foreground)]">
                        <div className="flex items-center gap-2 text-xs">
                          <ChatsCircle className="size-4" />
                          <span>12</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <CalendarBlank className="size-4" />
                          <span>{boardCards[index].due}</span>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
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
              <CheckCircle className="size-4 text-[var(--primary)]" weight="duotone" />
              <span>{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
