// Lets the user select the active workspace while persisting only its ID.
import { BuildingsIcon, CaretDownIcon, CheckIcon } from "@phosphor-icons/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DashboardWorkspace } from "@/feature/dashboard/types";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspace-store";

type WorkspaceSwitcherProps = {
  workspaces: DashboardWorkspace[];
  collapsed?: boolean;
};

export function WorkspaceSwitcher({
  workspaces,
  collapsed = false,
}: WorkspaceSwitcherProps) {
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const selected =
    workspaces.find((workspace) => workspace._id === selectedWorkspaceId) ??
    workspaces[0];

  if (!selected) {
    return (
      <div
        className={cn(
          "flex w-full items-center rounded-xl border border-dashed border-border bg-muted/35 p-2.5 text-left",
          collapsed ? "justify-center" : "gap-3",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <BuildingsIcon aria-hidden="true" size={17} />
        </span>
        {!collapsed ? (
          <span className="min-w-0">
            <span className="block text-[0.65rem] font-medium text-muted-foreground">
              Workspace
            </span>
            <span className="block text-sm font-bold text-muted-foreground">
              No workspace yet
            </span>
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label={`Current workspace: ${selected.name}`}
            className={cn(
              "flex w-full items-center rounded-xl border border-border bg-muted/55 p-2.5 text-left transition-colors hover:bg-muted",
              collapsed ? "justify-center" : "gap-3",
            )}
            type="button"
          />
        }
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--marketing-action)]/95 text-white">
          <BuildingsIcon aria-hidden="true" size={17} weight="fill" />
        </span>
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.65rem] font-medium text-muted-foreground">
                Workspace
              </span>
              <span className="block truncate text-sm font-bold">
                {selected.name}
              </span>
            </span>
            <CaretDownIcon aria-hidden="true" size={14} />
          </>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace._id}
              onClick={() => selectWorkspace(workspace._id)}
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-[var(--marketing-action-soft)] text-xs font-black text-[var(--marketing-action)]">
                {workspace.name[0]}
              </span>
              <span className="flex-1">{workspace.name}</span>
              {workspace._id === selected._id ? (
                <CheckIcon
                  aria-hidden="true"
                  className="text-[var(--marketing-action)]"
                  size={15}
                  weight="bold"
                />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
