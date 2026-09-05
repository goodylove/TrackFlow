import { UserCircleDashedIcon } from "@phosphor-icons/react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import type { IssueAssignee } from "@/feature/issues/types";
import { cn } from "@/lib/utils";

const avatarTones = [
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-800",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getToneIndex(name: string) {
  return [...name].reduce((total, character) => total + character.charCodeAt(0), 0) % avatarTones.length;
}

type AssigneeAvatarProps = {
  assignee: IssueAssignee | null;
};

export function AssigneeAvatar({ assignee }: AssigneeAvatarProps) {
  if (!assignee) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <UserCircleDashedIcon aria-hidden="true" size={18} />
        Unassigned
      </span>
    );
  }

  return (
    <span
      aria-label={`Assigned to ${assignee.name}`}
      className="inline-flex items-center gap-2"
      title={assignee.name}
    >
      <Avatar className="size-7 border-white ring-1 ring-black/8">
        {assignee.avatarUrl ? (
          <AvatarImage alt="" src={assignee.avatarUrl} />
        ) : null}
        <AvatarFallback
          className={cn(
            "text-[0.62rem] font-black",
            avatarTones[getToneIndex(assignee.name)],
          )}
        >
          {getInitials(assignee.name)}
        </AvatarFallback>
      </Avatar>
      <span className="sr-only">{assignee.name}</span>
    </span>
  );
}
