// Lets the user select the active workspace while persisting only its ID.
import {
  BuildingsIcon,
  CaretDownIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { DashboardWorkspace } from "@/feature/dashboard/types";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/stores/workspace-store";

type WorkspaceSwitcherProps = {
  workspaces: DashboardWorkspace[];
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function WorkspaceSwitcher({
  workspaces,
  collapsed = false,
  onNavigate,
}: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const optionsId = useId();
  const navigate = useNavigate();
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const selectWorkspace = useWorkspaceStore((state) => state.selectWorkspace);
  const selected =
    workspaces.find((workspace) => workspace._id === selectedWorkspaceId) ??
    workspaces[0];
  const otherWorkspaces = workspaces.filter(
    (workspace) => workspace._id !== selected?._id,
  );

  function handleWorkspaceSelection(workspaceId: string) {
    selectWorkspace(workspaceId);
    setIsOpen(false);
    onNavigate?.();
  }

  function handleAddWorkspace() {
    setIsOpen(false);
    navigate("/dashboard/workspace");
    onNavigate?.();
  }

  if (!selected) {
    return (
      <button
        className={cn(
          "flex w-full items-center rounded-xl border border-dashed border-border bg-muted/35 p-2.5 text-left transition-colors hover:border-[var(--marketing-action)]/35 hover:bg-[var(--marketing-action-soft)]",
          collapsed ? "justify-center" : "gap-3",
        )}
        onClick={handleAddWorkspace}
        type="button"
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
        {!collapsed ? (
          <PlusIcon
            aria-hidden="true"
            className="ml-auto text-[var(--marketing-action)]"
            size={16}
            weight="bold"
          />
        ) : null}
      </button>
    );
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex w-full items-center rounded-xl border border-border bg-muted/55 p-2.5 text-left transition-colors hover:bg-muted",
          collapsed ? "justify-center" : "gap-3",
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--marketing-action)]/90 text-white">
          <BuildingsIcon aria-hidden="true" size={16} weight="fill" />
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
            <button
              aria-controls={optionsId}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Hide workspaces" : "Show workspaces"}
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--marketing-action)]/35"
              onClick={() => setIsOpen((current) => !current)}
              type="button"
            >
              <CaretDownIcon
                aria-hidden="true"
                className={cn(
                  "transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
                size={14}
                weight="bold"
              />
            </button>
          </>
        ) : null}
      </div>

      {!collapsed && isOpen ? (
        <div
          className="animate-in fade-in slide-in-from-top-1 duration-200"
          id={optionsId}
        >
          <div className="mt-2 space-y-1 border-l border-[var(--marketing-border)] pl-3">
            {otherWorkspaces.map((workspace) => (
              <button
                className="group flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-muted-foreground transition-colors hover:bg-[var(--marketing-action-soft)] hover:text-[var(--marketing-action)]"
                key={workspace._id}
                onClick={() => handleWorkspaceSelection(workspace._id)}
                type="button"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-black text-muted-foreground transition-colors group-hover:bg-white group-hover:text-[var(--marketing-action)]">
                  {workspace.name[0]?.toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate">{workspace.name}</span>
              </button>
            ))}

            <button
              className="flex min-h-10  cursor-pointer w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-bold text-[var(--marketing-action)] transition-colors hover:bg-[var(--marketing-action-soft)]"
              onClick={handleAddWorkspace}
              type="button"
            >
              <PlusIcon aria-hidden="true" size={14} weight="bold" />

              Add workspace
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
