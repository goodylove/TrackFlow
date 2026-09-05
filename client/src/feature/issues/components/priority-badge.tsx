import {
  ArrowDownIcon,
  ArrowUpIcon,
  EqualsIcon,
  WarningDiamondIcon,
  type Icon,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import {
  issuePriorityLabels,
  type IssuePriority,
} from "@/feature/issues/types";
import { cn } from "@/lib/utils";

const priorityStyles: Record<
  IssuePriority,
  { className: string; icon: Icon }
> = {
  low: {
    className: "border-slate-200 bg-slate-50 text-slate-600",
    icon: ArrowDownIcon,
  },
  medium: {
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: EqualsIcon,
  },
  high: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: ArrowUpIcon,
  },
  urgent: {
    className: "border-red-200 bg-red-50 text-red-700",
    icon: WarningDiamondIcon,
  },
};

type PriorityBadgeProps = {
  priority: IssuePriority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { className, icon: PriorityIcon } = priorityStyles[priority];

  return (
    <Badge
      className={cn("gap-1 border px-2 py-1 font-bold", className)}
      variant="outline"
    >
      <PriorityIcon aria-hidden="true" size={12} weight="bold" />
      {issuePriorityLabels[priority]}
    </Badge>
  );
}
