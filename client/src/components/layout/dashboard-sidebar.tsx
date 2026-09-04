// Renders the reusable desktop and mobile dashboard navigation.
import {
  GearIcon,
  HouseIcon,
  ListChecksIcon,
  SidebarSimpleIcon,
  SignOutIcon,
  UsersThreeIcon,
  type Icon,
} from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

type NavItem = { label: string; icon: Icon; to?: string };
const navItems: NavItem[] = [
  { label: "Overview", icon: HouseIcon, to: "/dashboard" },
  { label: "Issues", icon: ListChecksIcon, to: "/dashboard/issues" },
  { label: "Members", icon: UsersThreeIcon, to: "/dashboard/members" },
  { label: "Settings", icon: GearIcon, to: "/dashboard/settings" },
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
  onNavigate,
}: DashboardSidebarProps) {
  const storedCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const collapsed = mobile ? false : storedCollapsed;
  const navigate = useNavigate();
  const location = useLocation();

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
        <div

          className="flex items-center gap-2 text-[0.98rem] font-bold tracking-tight text-[var(--marketing-action)]"
        >
          <span className="flex size-8 items-center justify-center rounded-[0.6rem] bg-[var(--marketing-action)]/95 text-white">
            <BrandMark />
          </span>
          {!collapsed ? <span>TrackFlow</span> : null}
        </div>



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
        {navItems.map(({ label, icon: NavIcon, to }) => {
          const isActive = to
            ? to === "/dashboard"
              ? location.pathname === to
              : location.pathname.startsWith(to)
            : false;
          const className = cn(
            "flex h-11 w-full items-center rounded-lg text-sm font-bold transition-colors",
            collapsed ? "justify-center" : "gap-3 px-3",
            isActive
              ? "bg-[var(--marketing-action)]/95 text-white shadow-[0_12px_24px_-16px_var(--marketing-accent-shadow)]"
              : "text-[var(--marketing-muted-foreground)] hover:bg-[var(--marketing-action-soft)] hover:text-[var(--marketing-action)]",
          );
          const content = (
            <>
              <NavIcon
                aria-hidden="true"
                size={19}
                weight={isActive ? "fill" : "regular"}
              />
              {!collapsed ? <span>{label}</span> : null}
            </>
          );
          const control = to ? (
            <Link
              aria-current={isActive ? "page" : undefined}
              aria-label={collapsed ? label : undefined}
              className={className}
              onClick={onNavigate}
              to={to}
            >
              {content}
            </Link>
          ) : (
            <button
              aria-label={collapsed ? `${label} (coming soon)` : undefined}
              className={cn(className, "cursor-not-allowed opacity-55")}
              disabled
              type="button"
            >
              {content}
            </button>
          );
          return collapsed ? (
            <Tooltip key={label}>
              <TooltipTrigger render={control} />
              <TooltipContent>{to ? label : `${label} - coming soon`}</TooltipContent>
            </Tooltip>
          ) : (
            <div key={label}>{control}</div>
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
