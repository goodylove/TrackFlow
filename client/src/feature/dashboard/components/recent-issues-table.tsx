// Displays the most recently updated issues using backend-compatible fields.
import { DotsThreeIcon } from "@phosphor-icons/react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDueDate, formatUpdatedTime, getInitials, priorityLabels, priorityStyles, statusLabels, statusStyles } from "@/feature/dashboard/dashboard-utils"
import type { DashboardIssue } from "@/feature/dashboard/types"

export function RecentIssuesTable({ issues }: { issues: DashboardIssue[] }) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="items-center border-b border-border/70">
        <div><CardTitle>Recent issues</CardTitle><p className="mt-1 text-xs text-muted-foreground">Latest updates in this workspace</p></div>
        <Button aria-label="View issue options" size="icon" variant="ghost"><DotsThreeIcon aria-hidden="true" size={20} weight="bold" /></Button>
      </CardHeader>
      <Table>
        <TableHeader><TableRow className="bg-muted/35 hover:bg-muted/35"><TableHead>Issue</TableHead><TableHead>Status</TableHead><TableHead>Priority</TableHead><TableHead>Assignee</TableHead><TableHead>Due date</TableHead><TableHead>Updated</TableHead></TableRow></TableHeader>
        <TableBody>
          {issues.slice(0, 6).map((issue) => (
            <TableRow key={issue._id}>
              <TableCell><div className="max-w-[17rem]"><p className="truncate font-bold text-foreground">{issue.title}</p><span className="text-[0.68rem] text-muted-foreground">{issue._id}</span></div></TableCell>
              <TableCell><Badge className={statusStyles[issue.status]} variant="outline">{statusLabels[issue.status]}</Badge></TableCell>
              <TableCell><Badge className={priorityStyles[issue.priority]} variant="outline">{priorityLabels[issue.priority]}</Badge></TableCell>
              <TableCell>{issue.assignee ? <div className="flex items-center gap-2"><Avatar className="size-7"><AvatarFallback>{getInitials(issue.assignee.name)}</AvatarFallback></Avatar><span className="text-xs font-medium">{issue.assignee.name}</span></div> : <span className="text-xs text-muted-foreground">Unassigned</span>}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{formatDueDate(issue.dueDate)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{formatUpdatedTime(issue.updatedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
