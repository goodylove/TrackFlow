// Visualizes current workspace issue volume grouped by issue creation month.
import { ChartLineUpIcon } from "@phosphor-icons/react";
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionEmptyState } from "@/feature/dashboard/components/section-empty-state";
import type { DashboardIssue } from "@/feature/dashboard/types";

export function StatusOverview({ issues }: { issues: DashboardIssue[] }) {
  const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });
  const recentMonths = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      name: monthFormatter.format(date),
      issues: 0,
    };
  });

  const monthlyTotals = new Map(
    recentMonths.map((month) => [month.key, { ...month }]),
  );

  issues.forEach((issue) => {
    const issueDate = new Date(issue.createdAt);

    if (Number.isNaN(issueDate.getTime())) return;

    const key = `${issueDate.getFullYear()}-${issueDate.getMonth()}`;
    const existingMonth = monthlyTotals.get(key);

    if (existingMonth) {
      existingMonth.issues += 1;
    }
  });

  const data = recentMonths.map((month) => monthlyTotals.get(month.key) ?? month);

  return (
    <Card className="min-h-[22rem]">
      <CardHeader>
        <div>
          <CardTitle>Issues by month</CardTitle>
          <CardDescription className="mt-1">
            New issues created across the last six months
          </CardDescription>
        </div>
        <span className="rounded-full bg-muted px-3 py-1.5 text-[0.7rem] font-bold text-muted-foreground">
          Last 6 months
        </span>
      </CardHeader>
      <CardContent className="h-[16.5rem] pt-2">
        {issues.length === 0 ? (
          <SectionEmptyState
            className="h-full"
            description="Create your first issue to start seeing workspace activity over time."
            icon={ChartLineUpIcon}
            title="No issue activity yet"
          />
        ) : (
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={data} margin={{ left: -22, right: 4, top: 8 }}>
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="4 6"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="name"
              fontSize={12}
              tick={{ fill: "var(--muted-foreground)" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              fontSize={11}
              tick={{ fill: "var(--muted-foreground)" }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={{
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "0 12px 30px rgba(22,32,25,.1)",
                fontFamily: "Satoshi",
              }}
              formatter={(value) => [`${value ?? 0}`, "Issues"]}
            />
            <Line
              dataKey="issues"
              dot={{ fill: "var(--marketing-action)", r: 4 }}
              activeDot={{ fill: "var(--marketing-action)", r: 5 }}
              stroke="var(--marketing-action)"
              strokeWidth={3}
              type="monotone"
            />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
