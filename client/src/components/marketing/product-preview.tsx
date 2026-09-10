import {
  CalendarBlank,
  ChatCircle,
  CheckCircle,
  Circle,
  DotsThree,
  Kanban,
  MagnifyingGlass,
  Plus,
  SpinnerGap,
  type Icon,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

type PreviewIssue = {
  id: string
  title: string
  priority: "Low" | "Medium" | "High"
  owner: string
  dueDate: string
  comments: number
}

type PreviewColumn = {
  name: string
  count: number
  accent: string
  icon: Icon
  iconClassName: string
  issues: PreviewIssue[]
}

const columns: PreviewColumn[] = [
  {
    name: "Todo",
    count: 3,
    accent: "bg-slate-400",
    icon: Circle,
    iconClassName: "text-slate-500",
    issues: [
      { id: "TF-128", title: "Improve dashboard empty states", priority: "Medium", owner: "TO", dueDate: "Sep 12", comments: 4 },
      { id: "TF-134", title: "Add export filters", priority: "Low", owner: "MA", dueDate: "Sep 16", comments: 2 },
    ],
  },
  {
    name: "In progress",
    count: 2,
    accent: "bg-[var(--marketing-action)]",
    icon: SpinnerGap,
    iconClassName: "text-[var(--marketing-action)]",
    issues: [
      { id: "TF-121", title: "Fix login redirect", priority: "High", owner: "GR", dueDate: "Sep 10", comments: 6 },
      { id: "TF-130", title: "Refine mobile issue view", priority: "Medium", owner: "TO", dueDate: "Sep 14", comments: 3 },
    ],
  },
  {
    name: "Done",
    count: 7,
    accent: "bg-[var(--landing-success)]",
    icon: CheckCircle,
    iconClassName: "text-[var(--landing-success)]",
    issues: [
      { id: "TF-116", title: "Add issue comments", priority: "High", owner: "MA", dueDate: "Sep 8", comments: 8 },
    ],
  },
]

const priorityClasses: Record<PreviewIssue["priority"], string> = {
  Low: "bg-[var(--landing-success-soft)] text-[var(--landing-success)]",
  Medium: "bg-[var(--landing-warning-soft)] text-[var(--landing-warning)]",
  High: "bg-[var(--landing-danger-soft)] text-[var(--landing-danger)]",
}

function PreviewCard({ issue }: { issue: PreviewIssue }) {
  return (
    <article className="rounded-xl border border-[var(--marketing-border)] bg-white p-3 shadow-[var(--landing-card-shadow)]">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[0.65rem] font-bold text-[var(--marketing-muted-foreground)]">{issue.id}</span>
        <span className={cn("rounded-full px-2 py-1 text-[0.58rem] font-black", priorityClasses[issue.priority])}>{issue.priority}</span>
      </div>
      <h3 className="mt-3 min-h-10 text-[0.78rem] font-black leading-5 text-[var(--marketing-foreground)]">{issue.title}</h3>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--marketing-border)] pt-3">
        <span className="grid size-7 place-items-center rounded-full bg-[var(--marketing-action-soft)] text-[0.65rem] font-black text-[var(--marketing-action)]">{issue.owner}</span>
        <span className="flex items-center gap-2 text-[0.65rem] font-semibold text-[var(--marketing-muted-foreground)]">
          <span className="inline-flex items-center gap-1"><CalendarBlank className="size-3.5" />{issue.dueDate}</span>
          <span className="inline-flex items-center gap-1"><ChatCircle className="size-3.5" />{issue.comments}</span>
        </span>
      </div>
    </article>
  )
}

export function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-[0.9rem] border border-[var(--marketing-preview-border)] bg-white shadow-[var(--landing-preview-shadow)]">
      <div className="flex h-8 items-center gap-1.5 bg-[var(--landing-ink)] px-3">
        {[0, 1, 2].map((dot) => <span className="size-2 rounded-full bg-white/25" key={dot} />)}
      </div>

      <div className="border-b border-[var(--marketing-border)] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--marketing-action)] text-white"><Kanban className="size-[1.125rem]" weight="fill" /></span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[var(--marketing-foreground)]">TrackFlow Development</p>
              <p className="text-[0.68rem] text-[var(--marketing-muted-foreground)]">12 issues · 4 team members</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--marketing-action)] px-3 py-2 text-[0.7rem] font-bold text-white"><Plus className="size-3.5" weight="bold" /><span className="hidden sm:inline">New issue</span></span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--marketing-border)] bg-[var(--landing-surface)] px-3 py-2 text-[0.7rem] text-[var(--marketing-muted-foreground)]"><MagnifyingGlass className="size-3.5" />Search issues</div>
          <span className="text-[0.68rem] font-bold text-[var(--marketing-action)]">Board view</span>
        </div>
      </div>

      <div
        aria-label="Issue board preview. Scroll horizontally to see every status column."
        className=" overflow-hidden  bg-[var(--landing-surface)] p-3 sm:p-4"
        role="region"
        tabIndex={0}
      >
        <div className="grid w-max grid-cols-3 gap-3 sm:w-auto sm:min-w-[40rem]">
          {columns.map((column) => {
            const StatusIcon = column.icon
            return (
              <section className="w-[13.5rem] snap-start rounded-xl border border-[var(--marketing-border)] bg-[var(--landing-panel)] p-2 sm:w-auto" key={column.name}>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-5 w-1 rounded-full", column.accent)} />
                    <StatusIcon className={cn("size-4", column.iconClassName)} weight={column.name === "Done" ? "fill" : "bold"} />
                    <span className="text-[0.72rem] font-black text-[var(--marketing-foreground)]">{column.name}</span>
                    <span className="rounded-full bg-white px-1.5 py-0.5 text-[0.62rem] text-[var(--marketing-muted-foreground)]">{column.count}</span>
                  </div>
                  <DotsThree className="size-4 text-[var(--marketing-muted-foreground)]" weight="bold" />
                </div>
                <div className="space-y-3">{column.issues.map((issue) => <PreviewCard issue={issue} key={issue.id} />)}</div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
