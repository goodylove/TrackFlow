import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

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
  user: DashboardUser;
  workspaces: DashboardWorkspace[];
};

export function DashboardShell({
  children,
  user,
  workspaces,
}: DashboardShellProps) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <TooltipProvider>
      <div className="dashboard-shell flex min-h-screen bg-background text-foreground">
        <div className="sticky top-0 hidden h-screen lg:block">
          <DashboardSidebar workspaces={workspaces} />
        </div>
        <div className="min-w-0 flex-1">
          <DashboardHeader
            onOpenNavigation={() => setMobileNavigationOpen(true)}
            user={user}
          />
          <main className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto w-full max-w-[100rem]"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              key={location.pathname}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
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
