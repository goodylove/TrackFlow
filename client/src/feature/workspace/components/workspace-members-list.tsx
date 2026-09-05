// Renders a responsive, searchable directory from workspace membership records.
import {
  ArrowClockwiseIcon,
  DotsThreeIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  UserSwitchIcon,
  UsersThreeIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useDeferredValue, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { WorkspaceMember } from "@/feature/dashboard/services/workspace-service";
import { cn } from "@/lib/utils";

type WorkspaceMembersListProps = {
  currentUserId: string;
  members: WorkspaceMember[];
  onChangeRole?: (member: WorkspaceMember) => void;
  canRemoveMember?: (member: WorkspaceMember) => boolean;
  onRemoveMember?: (member: WorkspaceMember) => void;
};

const roleLabels: Record<WorkspaceMember["role"], string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

const roleStyles: Record<WorkspaceMember["role"], string> = {
  owner:
    "border-[var(--marketing-action)]/15 bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]",
  admin: "border-blue-200 bg-blue-50 text-blue-700",
  member: "border-border bg-muted/60 text-muted-foreground",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatJoinedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function WorkspaceMembersList({
  currentUserId,
  members,
  onChangeRole,
  canRemoveMember,
  onRemoveMember,
}: WorkspaceMembersListProps) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const filteredMembers = members.filter(({ user }) =>
    `${user.name} ${user.email}`.toLowerCase().includes(deferredSearch),
  );
  const hasMemberActions = Boolean(onChangeRole || onRemoveMember);

  return (
    <section
      aria-labelledby="members-directory-title"
      className="overflow-hidden rounded-2xl border border-[var(--marketing-border)] bg-white shadow-[0_16px_40px_-34px_rgba(23,23,34,0.35)]"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--marketing-border)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black" id="members-directory-title">
              Members
            </h2>
            <Badge variant="secondary">
              {members.length} {members.length === 1 ? "member" : "members"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            People who can access this workspace.
          </p>
        </div> */}
        <label className="relative block w-full sm:w-72">
          <span className="sr-only">Search members</span>
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={17}
          />
          <Input
            className="h-10 rounded-lg border-[var(--marketing-border)] bg-white pl-9 pr-3 text-sm"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email"
            type="search"
            value={search}
          />
        </label>
      </div>

      {filteredMembers.length > 0 ? (
        <div>
          <div
            className={cn(
              "hidden gap-4 border-b border-[var(--marketing-border)] bg-muted/20 px-6 py-3 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-muted-foreground md:grid",
              hasMemberActions
                ? "grid-cols-[minmax(0,1.6fr)_0.7fr_0.8fr_0.8fr_2.5rem]"
                : "grid-cols-[minmax(0,1.6fr)_0.7fr_0.8fr_0.8fr]",
            )}
          >
            <span>Member</span>
            <span>Role</span>
            <span>Status</span>
            <span>Joined</span>
            {hasMemberActions ? <span className="sr-only">Actions</span> : null}
          </div>
          <ul className="divide-y divide-[var(--marketing-border)]">
            {filteredMembers.map((membership) => {
              const { user } = membership;
              const isCurrentUser = user._id === currentUserId;
              const canChangeRole = Boolean(
                onChangeRole && membership.role !== "owner",
              );
              const canRemove = Boolean(
                onRemoveMember && canRemoveMember?.(membership),
              );

              return (
                <li
                  className={cn(
                    "relative grid gap-4 px-5 py-4 transition-colors hover:bg-muted/20 sm:px-6 md:items-center",
                    hasMemberActions
                      ? "md:grid-cols-[minmax(0,1.6fr)_0.7fr_0.8fr_0.8fr_2.5rem]"
                      : "md:grid-cols-[minmax(0,1.6fr)_0.7fr_0.8fr_0.8fr]",
                  )}
                  key={membership._id}
                >
                  <div className={cn("flex min-w-0 items-center gap-3", hasMemberActions && "pr-12 md:pr-0")}>
                    <Avatar className="size-10">
                      {user.avatarUrl ? (
                        <AvatarImage alt="" src={user.avatarUrl} />
                      ) : null}
                      <AvatarFallback className="bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {user.name}
                        {isCurrentUser ? (
                          <span className="ml-1.5 font-medium text-muted-foreground">
                            (You)
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted-foreground md:hidden">
                      Role
                    </span>
                    <Badge className={roleStyles[membership.role]}>
                      {roleLabels[membership.role]}
                    </Badge>
                  </div>
                  <div>
                    <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted-foreground md:hidden">
                      Status
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-2 rounded-full",
                          user.status === "active" ? "bg-emerald-500" : "bg-red-500",
                        )}
                      />
                      {user.status === "active" ? "Active" : "Suspended"}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {user.isEmailVerified ? "Email verified" : "Email unverified"}
                    </span>
                  </div>
                  <div>
                    <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-muted-foreground md:hidden">
                      Joined
                    </span>
                    <span className="text-sm font-medium text-foreground/80">
                      {formatJoinedDate(membership.joinedAt)}
                    </span>
                  </div>
                  {hasMemberActions ? (
                    <div className="absolute right-4 top-4 md:static">
                      {canChangeRole || canRemove ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                aria-label={`Actions for ${user.name}`}
                                className="size-9 rounded-lg text-muted-foreground"
                                size="icon"
                                type="button"
                                variant="ghost"
                              />
                            }
                          >
                            <DotsThreeIcon aria-hidden="true" size={20} weight="bold" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            {canChangeRole ? (
                              <DropdownMenuItem onClick={() => onChangeRole?.(membership)}>
                                <UserSwitchIcon aria-hidden="true" size={16} />
                                Change role
                              </DropdownMenuItem>
                            ) : null}
                            {canChangeRole && canRemove ? <DropdownMenuSeparator /> : null}
                            {canRemove ? (
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10"
                                onClick={() => onRemoveMember?.(membership)}
                              >
                                <TrashIcon aria-hidden="true" size={16} />
                                Remove member
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <UsersThreeIcon aria-hidden="true" size={22} />
          </span>
          <h3 className="mt-4 text-base font-black">
            {members.length === 0 ? "No members yet" : "No matching members"}
          </h3>
          <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
            {members.length === 0
              ? "This workspace does not have any active membership records."
              : "Try a different name or email address."}
          </p>
          {members.length > 0 ? (
            <Button
              className="mt-4 h-9 rounded-lg"
              onClick={() => setSearch("")}
              type="button"
              variant="outline"
            >
              Clear search
            </Button>
          ) : null}
        </div>
      )}
    </section>
  );
}

export function WorkspaceMembersLoadingState() {
  return (
    <section
      aria-label="Loading workspace members"
      aria-live="polite"
      className="overflow-hidden rounded-2xl border border-[var(--marketing-border)] bg-white"
      role="status"
    >
      <span className="sr-only">Loading workspace members...</span>
      <div aria-hidden="true" className="animate-pulse">
        <div className="flex justify-between border-b border-[var(--marketing-border)] p-6">
          <div className="space-y-2">
            <div className="h-5 w-36 rounded bg-muted" />
            <div className="h-4 w-52 rounded bg-muted/70" />
          </div>
          <div className="hidden h-10 w-64 rounded-lg bg-muted sm:block" />
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="flex items-center gap-3 border-b border-[var(--marketing-border)] p-5 sm:px-6" key={index}>
            <div className="size-10 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-36 rounded bg-muted" />
              <div className="h-3 w-48 rounded bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type WorkspaceMembersErrorStateProps = {
  message: string;
  onRetry: () => void;
  retrying: boolean;
};

export function WorkspaceMembersErrorState({
  message,
  onRetry,
  retrying,
}: WorkspaceMembersErrorStateProps) {
  return (
    <section
      aria-labelledby="members-error-title"
      className="flex min-h-80 items-center justify-center rounded-2xl border border-[var(--marketing-border)] bg-white px-5 py-10 text-center"
    >
      <div className="flex max-w-sm flex-col items-center">
        <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <WarningCircleIcon aria-hidden="true" size={22} weight="fill" />
        </span>
        <h2 className="mt-4 text-lg font-black" id="members-error-title">
          Members are unavailable
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
        <Button
          className="mt-5 h-10 rounded-lg"
          disabled={retrying}
          onClick={onRetry}
          type="button"
          variant="outline"
        >
          <ArrowClockwiseIcon
            aria-hidden="true"
            className={retrying ? "animate-spin" : undefined}
            size={17}
          />
          {retrying ? "Trying again..." : "Try again"}
        </Button>
      </div>
    </section>
  );
}
