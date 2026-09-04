import { useState, type ReactNode } from "react";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { DashboardUser, DashboardWorkspace } from "@/feature/dashboard/types";

type DashboardShellProps = {
  children: ReactNode;
  user:DashboardUser;
  workspaces: DashboardWorkspace[];
};

export function DashboardShell({
  children,
  user,
  workspaces,
}: DashboardShellProps) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-[var(--marketing-bg)] text-[#171722]">
        <div className="sticky top-0 hidden h-screen lg:block">
          <DashboardSidebar workspaces={workspaces} />
        </div>
        <div className="min-w-0 flex-1">
          <DashboardHeader
            onOpenNavigation={() => setMobileNavigationOpen(true)}
            user={user}
          />
          <main className=" w-full  p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      <Sheet
        onOpenChange={(open) => setMobileNavigationOpen(open)}
        open={mobileNavigationOpen}
      >
        <SheetContent
          aria-describedby="mobile-navigation-description"
          aria-labelledby="mobile-navigation-title"
          className="p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle id="mobile-navigation-title">
              Dashboard navigation
            </SheetTitle>
            <SheetDescription id="mobile-navigation-description">
              Navigate the TrackFlow workspace
            </SheetDescription>
          </SheetHeader>
          <DashboardSidebar
            user={user}
            mobile
            onNavigate={() => setMobileNavigationOpen(false)}
            workspaces={workspaces}
          />
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
