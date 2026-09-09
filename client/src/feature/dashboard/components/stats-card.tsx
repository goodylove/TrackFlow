// Renders a single dashboard issue metric with a consistent icon treatment.
import type { Icon } from "@phosphor-icons/react"

import { Card } from "@/components/ui/card"

type StatsCardProps = {
  label: string
  value: number
  helper: string
  icon: Icon
  tone: "total" | "assigned" | "unassigned" | "overdue"
}

const toneStyles: Record<StatsCardProps["tone"], string> = {
  total: "bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]",
  assigned: "bg-[var(--status-success-soft)] text-[var(--status-success)]",
  unassigned: "bg-amber-50 text-amber-600",
  overdue: "bg-red-50 text-red-600",
}

const toneBars: Record<StatsCardProps["tone"], string> = {
  total: "bg-[var(--marketing-action)]",
  assigned: "bg-[var(--status-success)]",
  unassigned: "bg-amber-500",
  overdue: "bg-red-500",
}

export function StatsCard({ label, value, helper, icon: MetricIcon, tone }: StatsCardProps) {
  return (
    <Card aria-label={`${label}: ${value}. ${helper}`} className="group relative overflow-hidden p-5 transition-shadow duration-200 hover:border-[var(--marketing-border-strong)] hover:shadow-[0_18px_38px_-28px_rgba(23,23,34,0.32)]">
      <span aria-hidden="true" className={`absolute inset-y-5 left-0 w-0.5 rounded-r-full ${toneBars[tone]}`} />
      <div className="flex items-start justify-between gap-4">
        <p className="pt-1 text-xs font-bold text-muted-foreground">{label}</p>
        <div className={`rounded-xl p-2.5 ${toneStyles[tone]}`}>
          <MetricIcon aria-hidden="true" size={18} weight="bold" />
        </div>
      </div>
      <div className="mt-5">
        <strong className="block text-[2rem] font-black leading-none tracking-[-0.045em]">{value}</strong>
        <span className="mt-2 block text-xs text-muted-foreground">{helper}</span>
      </div>
    </Card>
  )
}
