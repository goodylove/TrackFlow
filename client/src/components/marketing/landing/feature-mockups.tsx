import { CalendarBlank, ChatsCircle, Flag, Kanban, MagnifyingGlass, Plus, UserCircle } from "@phosphor-icons/react"

import { boardCards, boardColumns, workspaces } from "@/constants/dummy"
import { cn } from "@/lib/utils"

export function CoordinationMockup() {
  return <div className="relative mt-8 overflow-hidden rounded-[0.95rem] bg-white p-4 text-left shadow-[0_22px_48px_-36px_rgba(17,16,28,0.45)]">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-[0.6rem] bg-[#17152f] text-white"><Kanban className="size-4" weight="fill" /></span><div><p className="text-[0.78rem] font-black text-[#171722]">TrackFlow Development</p><p className="text-[0.68rem] font-bold text-[var(--marketing-muted-foreground)]">Sprint workspace</p></div></div>
      <button className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--marketing-action)]/95 px-3 py-2 text-[0.68rem] font-black text-white" type="button"><Plus className="size-3.5" />New issue</button>
    </div>
    <div className="grid gap-3 rounded-[0.8rem] border border-[var(--marketing-border)] bg-[#f7f8fc] p-3 sm:grid-cols-[6rem_1fr]">
      <div className="rounded-[0.7rem] bg-[#202033] p-2 text-white ">{workspaces.slice(0, 4).map((workspace, index) => <div key={workspace} className={cn("rounded-[0.55rem] px-2 py-2 text-[0.62rem] font-bold", index === 0 ? "bg-[var(--marketing-action)]/95" : "text-white/58")}>{workspace.split(" ")[0]}</div>)}</div>
      <div className="space-y-3">
        {boardCards.slice(0, 5).map((issue, index) => <article key={issue.title} className="rounded-[0.72rem] border border-[var(--marketing-border)] bg-white p-3 shadow-[0_10px_24px_-22px_rgba(17,16,28,0.45)]"><div className="flex items-start justify-between gap-3"><div><p className="text-[0.76rem] font-black leading-5 text-[#171722]">{issue.title}</p><div className="mt-2 flex flex-wrap items-center gap-2 text-[0.62rem] font-bold text-[var(--marketing-muted-foreground)]"><span className="inline-flex items-center gap-1"><CalendarBlank className="size-3.5" />{issue.dueDate}</span><span className="inline-flex items-center gap-1"><ChatsCircle className="size-3.5" />{issue.comments} comments</span></div></div><span className={cn("rounded-full px-2 py-1 text-[0.6rem] font-black", index === 0 ? "bg-[#fff0f0] text-[#b42318]" : "bg-[#fff7dc] text-[#8a5b00]")}>{issue.priority}</span></div></article>)}
        <div className="grid grid-cols-3 gap-2">{boardColumns.map((column) => <div key={column.name} className="rounded-[0.65rem] bg-white px-2 py-2"><p className="text-[0.58rem] font-black uppercase text-[#707386]">{column.name}</p><p className="mt-1 text-sm font-black text-[#171722]">{column.count}</p></div>)}</div>
      </div>
    </div>
  </div>
}

export function ProjectListMockup() {
  return <div className="relative mx-auto mt-8 max-w-[40rem] rounded-[0.95rem] bg-white p-4 text-left shadow-[0_22px_48px_-36px_rgba(17,16,28,0.45)]">
    <div className="flex items-center justify-between"><div><h4 className="text-sm font-black text-[#171722]">Workspace issues</h4><p className="mt-1 text-[0.68rem] font-bold text-[var(--marketing-muted-foreground)]">Sorted by next action</p></div><span className="rounded-full bg-[var(--marketing-action-soft)] px-2.5 py-1 text-[0.62rem] font-black text-[var(--marketing-action)]">Live</span></div>
    <div className="mt-4 flex items-center gap-2 rounded-[0.65rem] bg-[#f7f8fc] px-3 py-2 text-[0.72rem] text-[var(--marketing-muted-foreground)]"><MagnifyingGlass className="size-3.5 shrink-0" /><span>Search issue title or owner</span></div>
    <div className="mt-2 space-y-2.5">{boardCards.map((issue, index) => <div key={issue.title} className="rounded-[0.75rem] border border-[var(--marketing-border)] bg-white px-3 py-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-[0.76rem] font-black text-[#171722]">{issue.title}</p><div className="mt-2 flex items-center gap-2 text-[0.62rem] font-bold text-[var(--marketing-muted-foreground)]"><UserCircle className="size-3.5" />{["Grace", "Tobi", "Maya"][index]}</div></div><span className={cn("shrink-0 rounded-full px-2 py-1 text-[0.58rem] font-black", index === 0 ? "bg-[#18172f] text-white" : index === 1 ? "bg-[#fff7dc] text-[#8a5b00]" : "bg-[#eef7f0] text-[#236640]")}>{boardColumns[index]?.name ?? "Open"}</span></div></div>)}</div>
    <div className="mt-4 rounded-[0.75rem] border border-dashed border-[var(--marketing-border)] bg-[#f8f9fc] px-3 py-3"><div className="flex items-center justify-between gap-3"><span className="text-[0.7rem] font-black text-[#171722]">Next review queue</span><span className="text-[0.65rem] font-bold text-[var(--marketing-action)]">Open board</span></div></div>
  </div>
}

export function VisibilityMockup() {
  return <div className="rounded-[0.95rem] bg-white p-4 text-left shadow-[0_22px_48px_-36px_rgba(17,16,28,0.45)]">
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 rounded-[0.65rem] bg-[#f7f8fc] px-3 py-2 text-[0.72rem] text-[var(--marketing-muted-foreground)]"><MagnifyingGlass className="size-3.5" />Search team work</div><span className="rounded-full bg-[#18172f] px-3 py-1.5 text-[0.62rem] font-black text-white">3 active owners</span></div>
    <div className="mt-4 space-y-3">{[["Grace", "Fix login redirect after authentication", "High"], ["Tobi", "Improve dashboard empty states", "Medium"], ["Maya", "Add pagination to issue comments", "Low"]].map(([name, issue, priority], index) => <div key={name} className="rounded-[0.78rem] border border-[var(--marketing-border)] bg-[#fafbfe] px-3 py-3"><div className="flex items-start gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-[var(--marketing-action-soft)] text-[0.7rem] font-black text-[var(--marketing-action)]">{name.slice(0, 1)}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-[0.75rem] font-black text-[#171722]">{name}</p><span className={cn("rounded-full px-2 py-0.5 text-[0.56rem] font-black", index === 0 ? "bg-[#fff0f0] text-[#b42318]" : index === 1 ? "bg-[#fff7dc] text-[#8a5b00]" : "bg-[#eef7f0] text-[#236640]")}>{priority}</span></div><p className="mt-1 truncate text-[0.72rem] font-bold text-[#55586a]">{issue}</p><div className="mt-2 flex flex-wrap gap-2 text-[0.6rem] font-bold text-[var(--marketing-muted-foreground)]"><span className="inline-flex items-center gap-1"><Flag className="size-3" />{boardColumns[index]?.name}</span><span className="inline-flex items-center gap-1"><CalendarBlank className="size-3" />{boardCards[index]?.dueDate}</span></div></div><span className={cn("mt-1 size-3 rounded-[0.2rem] border", index !== 2 && "border-[var(--marketing-action)] bg-[var(--marketing-action)]/95")} /></div></div>)}</div>
  </div>
}
