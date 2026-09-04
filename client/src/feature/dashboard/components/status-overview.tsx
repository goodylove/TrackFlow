// Visualizes the current workspace issue count grouped by backend status values.
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardIssue, IssueStatus } from "@/feature/dashboard/types"
import { statusLabels } from "@/feature/dashboard/dashboard-utils"

export function StatusOverview({ issues }: { issues: DashboardIssue[] }) {
  const order: IssueStatus[] = ["todo", "in_progress", "done"]
  const data = order.map((status) => ({ name: statusLabels[status], issues: issues.filter((issue) => issue.status === status).length }))

  return (
    <Card className="min-h-[22rem]">
      <CardHeader>
        <div>
          <CardTitle>Issues by status</CardTitle>
          <CardDescription className="mt-1">How work is moving through the current workflow</CardDescription>
        </div>
        <span className="rounded-full bg-muted px-3 py-1.5 text-[0.7rem] font-bold text-muted-foreground">Current workspace</span>
      </CardHeader>
      <CardContent className="h-[16.5rem] pt-2">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data} margin={{ left: -22, right: 4, top: 8 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" vertical={false} />
            <XAxis axisLine={false} dataKey="name" fontSize={12} tick={{ fill: "var(--muted-foreground)" }} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} fontSize={11} tick={{ fill: "var(--muted-foreground)" }} tickLine={false} />
            <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 12px 30px rgba(22,32,25,.1)", fontFamily: "Satoshi" }} />
            <Bar dataKey="issues" fill="var(--marketing-action)" radius={[8, 8, 2, 2]} barSize={54} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
