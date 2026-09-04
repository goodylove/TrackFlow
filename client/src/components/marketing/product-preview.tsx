import {
  DotsThree,
  Kanban,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react"

import { boardColumns } from "@/constants/dummy"
import { cn } from "@/lib/utils"

const tabs = ["Overview", "Issues", "Members", "Comments"]

export function ProductPreview() {
  return (
    <div className="relative w-full lg:-mr-32">
      <div className="absolute -inset-5 rounded-[2rem] bg-[var(--marketing-action-soft)] blur-2xl" />

      <div className="relative overflow-hidden rounded-[0.9rem] border border-[var(--marketing-preview-border)] bg-white shadow-[0_26px_60px_-34px_rgba(24,23,52,0.55)]">
        <div className="h-8 bg-[linear-gradient(90deg,#9b9cb7,#17152f_42%,var(--marketing-action)_100%)]" />

        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-[0.65rem] bg-[var(--marketing-action)]/95 text-white">
                  <Kanban className="size-4" weight="fill" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--marketing-action)]">TrackFlow</p>
                  <p className="text-[0.65rem] font-medium text-[var(--marketing-muted-foreground)]">
                    Issue management
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-[0.7rem] font-semibold text-[var(--marketing-muted-foreground)]">
                {tabs.map((tab, index) => (
                  <span
                    key={tab}
                    className={cn(index === 1 && "text-[var(--marketing-action)]")}
                  >
                    {tab}
                  </span>
                ))}
              </div>
            </div>

            <span className="size-7 rounded-full bg-[#f0f1f7]" />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-[var(--marketing-border)] pt-4">
            {/* <div className="flex items-center gap-2 rounded-[var(--radius-pill)] bg-[#18172f] px-3 py-2 text-[0.72rem] font-semibold text-white">
              <span className="size-1.5 rounded-full bg-white" />
              TrackFlow
            </div> */}

            <div className="flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--marketing-action)]/95 px-3 py-2 text-[0.72rem] font-semibold text-white">
              <Plus className="size-3.5" />
              New issue
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-[0.8rem] bg-[#f6f7fb] px-3 py-2">
            <div className="flex items-center gap-2 text-[0.72rem] text-[var(--marketing-muted-foreground)]">
              <MagnifyingGlass className="size-3.5" />
              Search issues
            </div>
            <DotsThree className="size-4 text-[var(--marketing-muted-foreground)]" weight="bold" />
          </div>

          <div className="mt-4 grid min-w-[34rem] grid-cols-3 gap-3">
            {boardColumns.map((column) => (
              <div
                key={column.name}
                className="rounded-[0.8rem] border border-[var(--marketing-border)] bg-[#f8f9fc] p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#3e4054]">
                      {column.name}
                    </span>
                    <span className="rounded-full bg-white px-1.5 py-0.5 text-[0.6rem] text-[var(--marketing-muted-foreground)]">
                      {column.count}
                    </span>
                  </div>
                  <DotsThree className="size-3.5 text-[var(--marketing-muted-foreground)]" weight="bold" />
                </div>

                <article className="mt-3 rounded-[0.75rem] border border-[var(--marketing-border)] bg-white p-3 shadow-[0_12px_24px_-22px_rgba(17,16,28,0.4)]">
                  {/* <div className="flex items-center justify-between gap-2">
                      <span className={cn("rounded-full px-2 py-1 text-[0.62rem] font-bold", priorityClass(issue.priority))}>
                        {issue.priority}
                      </span>
                      <CheckCircle className="size-4 text-[var(--marketing-action)]" weight="fill" />
                    </div> */}
                  <div className="mt-4 space-y-2">
                    <div className="h-2 rounded-full bg-[#edeef5]" />
                    <div className="h-2 w-2/3 rounded-full bg-[#f1f2f7]" />
                  </div>

                  {/* <h3 className="mt-3 line-clamp-2 text-[0.78rem] font-bold leading-5 text-[#202033]">
                      {issue.title}
                    </h3> */}
                  <div className="mt-4 space-y-2">
                    <div className="h-2 rounded-full bg-[#edeef5]" />
                    {/* <div className="h-2 w-2/3 rounded-full bg-[#f1f2f7]" /> */}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="h-2 rounded-full bg-[#edeef5]" />
                    <div className="h-2 w-2/3 rounded-full bg-[#f1f2f7]" />
                  </div>
                </article>

                <div className="mt-3 rounded-[0.75rem] border border-dashed border-[var(--marketing-border)] bg-white/75 px-3 py-4">
                  <div className="h-2 rounded-full bg-[#eeeff6]" />
                  <div className="mt-2 h-2 w-3/4 rounded-full bg-[#f3f4f8]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
