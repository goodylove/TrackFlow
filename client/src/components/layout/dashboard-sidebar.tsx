// Renders the reusable desktop and mobile dashboard navigation.
import {
  GearIcon,
  HouseIcon,
  KanbanIcon,
  ListChecksIcon,
  SidebarSimpleIcon,
  SignOutIcon,
  UsersThreeIcon,
  type Icon,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import type { DashboardUser, DashboardWorkspace } from "@/feature/dashboard/types";
import { cn } from "@/lib/utils";
import { resetClientState } from "@/stores/reset-client-state";
import { useUiStore } from "@/stores/ui-store";
import { BrandMark } from "../shared/brandMark";

type NavItem = { label: string; icon: Icon };
const navItems: NavItem[] = [
  { label: "Overview", icon: HouseIcon },
  { label: "Issues", icon: ListChecksIcon },
  { label: "Members", icon: UsersThreeIcon },
  { label: "Settings", icon: GearIcon },
];

type DashboardSidebarProps = {
  user?: DashboardUser,

  workspaces: DashboardWorkspace[];
  mobile?: boolean;
  onNavigate?: () => void;
};

export function DashboardSidebar({
  workspaces,
  mobile = false,
  user,
  onNavigate,
}: DashboardSidebarProps) {
  const storedCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const collapsed = mobile ? false : storedCollapsed;
  const navigate = useNavigate();

  function logout() {
    resetClientState();
    navigate("/login");
    onNavigate?.();
  }

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-[var(--marketing-border)] bg-white transition-[width] duration-300 ease-out",
        mobile ? "w-full border-r-0" : collapsed ? "w-[5.25rem]" : "w-[17rem]",
      )}
    >
      <div
        className={cn(
          "flex h-20 items-center border-b border-[var(--marketing-border)]",
          collapsed ? "justify-center px-3" : "justify-between px-5",
        )}
      >
        <Link
          aria-label="TrackFlow home"
          to="/"
          className="flex items-center gap-2 text-[0.98rem] font-bold tracking-tight text-[var(--marketing-action)]"
        >
          <span className="flex size-8 items-center justify-center rounded-[0.6rem] bg-[var(--marketing-action)]/95 text-white">
            <BrandMark />
          </span>
          {!collapsed ? <span>TrackFlow</span> : null}
        </Link>



        {!mobile && !collapsed ? (
          <Button
            aria-label="Collapse sidebar"
            onClick={toggleSidebar}
            size="icon"
            variant="ghost"
          >
            <SidebarSimpleIcon aria-hidden="true" size={16} />
          </Button>
        ) : null}
      </div>
      <div className={cn("py-5", collapsed ? "px-3" : "px-4")}>
        <WorkspaceSwitcher collapsed={collapsed} workspaces={workspaces} />
      </div>
      <nav
        aria-label="Dashboard navigation"
        className={cn("flex-1 space-y-1", collapsed ? "px-3" : "px-4")}
      >
        {navItems.map(({ label, icon: NavIcon }, index) => {
          const button = (
            <button
              aria-current={index === 0 ? "page" : undefined}
              className={cn(
                "flex h-11 w-full items-center rounded-lg text-sm font-bold transition-colors cursor-pointer",
                collapsed ? "justify-center" : "gap-3 px-3",
                index === 0
                  ? "bg-[var(--marketing-action)]/95 text-white shadow-[0_12px_24px_-16px_var(--marketing-accent-shadow)]"
                  : "text-[var(--marketing-muted-foreground)] hover:bg-[var(--marketing-action-soft)] hover:text-[var(--marketing-action)]",
              )}
              onClick={onNavigate}
              type="button"
            >
              <NavIcon
                aria-hidden="true"
                size={19}
                weight={index === 0 ? "fill" : "regular"}
              />
              {!collapsed ? <span>{label}</span> : null}
            </button>
          );
          return collapsed ? (
            <Tooltip key={label}>
              <TooltipTrigger render={button} />
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ) : (
            <div key={label}>{button}</div>
          );
        })}
      </nav>
      <div
        className={cn(
          "border-t border-[var(--marketing-border)] py-4",
          collapsed ? "px-3" : "px-4",
        )}
      >
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  aria-label="Log out"
                  className="flex size-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={logout}
                  type="button"
                />
              }
            >
              <SignOutIcon aria-hidden="true" size={19} />
            </TooltipTrigger>
            <TooltipContent>Log out</TooltipContent>
          </Tooltip>
        ) : (
          <button
            className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={logout}
            type="button"
          >
            <SignOutIcon aria-hidden="true" size={19} />
            Log out
          </button>
        )}
        {!mobile && collapsed ? (
          <Button
            aria-label="Expand sidebar"
            className="mt-2"
            onClick={toggleSidebar}
            size="icon"
            variant="ghost"
          >
            <SidebarSimpleIcon
              aria-hidden="true"
              className="rotate-180"
              size={19}
            />
          </Button>
        ) : null}
      </div>
    </aside>
  );
}
