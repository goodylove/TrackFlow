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
  assigned: "bg-emerald-50 text-emerald-600",
  unassigned: "bg-amber-50 text-amber-600",
  overdue: "bg-red-50 text-red-600",
}

export function StatsCard({ label, value, helper, icon: MetricIcon, tone }: StatsCardProps) {
  return (
    <Card className="group relative min-h-32 overflow-hidden p-5">
      <p className=" text-xs font-medium text-muted-foreground">{label}</p>

      <div className="flex items-start justify-between my-4">
        <div className={`rounded-xl p-2 ${toneStyles[tone]}`}>
          <MetricIcon aria-hidden="true" size={18} weight="bold" />
        </div>

      </div>
      <div className="ml-1 flex items-end justify-between gap-2 ">
        <strong className="text-2xl font-black tracking-[-0.04em]">{value}</strong>
        <span className="pb-1 text-[0.68rem] text-muted-foreground">{helper}</span>
      </div>
    </Card>
  )
}
