// Visualizes issue priority distribution using the existing Recharts dependency.
import { FlagIcon } from "@phosphor-icons/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionEmptyState } from "@/feature/dashboard/components/section-empty-state";
import { priorityLabels } from "@/feature/dashboard/dashboard-utils";
import type {
  DashboardIssue,
  IssuePriority,
} from "@/feature/dashboard/types";

const priorities: IssuePriority[] = ["low", "medium", "high", "urgent"];
const colors: Record<IssuePriority, string> = {
  low: "#dfe1e8",
  medium: "#a7acf9",
  high: "#6269f6",
  urgent: "#2f37f4",
};

export function PriorityOverview({ issues }: { issues: DashboardIssue[] }) {
  const data = priorities.map((priority) => ({
    name: priorityLabels[priority],
    value: issues.filter((issue) => issue.priority === priority).length,
    priority,
  }));

  return (
    <Card className="min-h-[22rem]">
      <CardHeader>
        <div>
          <CardTitle>Priority overview</CardTitle>
          <CardDescription className="mt-1">
            Attention level across all open and closed issues
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <SectionEmptyState
            className="min-h-[15.75rem]"
            description="Priority distribution will appear as soon as issues are added to this workspace."
            icon={FlagIcon}
            title="No priority data yet"
          />
        ) : (
          <>
            <div className="relative mx-auto h-44 max-w-52">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={data}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {data.map((entry) => (
                      <Cell
                        fill={colors[entry.priority]}
                        key={entry.priority}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontFamily: "Satoshi",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <strong className="text-3xl font-black">{issues.length}</strong>
                <span className="text-[0.68rem] text-muted-foreground">
                  Total issues
                </span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {data.map((entry) => (
                <div
                  className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2"
                  key={entry.priority}
                >
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: colors[entry.priority] }}
                    />
                    {entry.name}
                  </span>
                  <strong className="text-xs">{entry.value}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
