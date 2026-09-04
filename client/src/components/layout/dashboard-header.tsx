// Renders the shared dashboard search bar, mobile navigation trigger, and account actions.
import { BellIcon, ListIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DashboardHeaderProps = {
  user: { name: string; email: string };
  onOpenNavigation: () => void;
};

export function DashboardHeader({
  user,
  onOpenNavigation,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center  justify-center gap-3 border-b border-[var(--marketing-border)] bg-[rgba(246,246,248,0.9)] px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <Button
        aria-label="Open navigation"
        className="lg:hidden"
        onClick={onOpenNavigation}
        size="icon"
        variant="outline"
      >
        <ListIcon aria-hidden="true" size={20} />
      </Button>
      <label className="relative max-w-xl flex-1">
        <span className="sr-only">Search issues</span>
        <MagnifyingGlassIcon
          aria-hidden="true"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          className="h-11 rounded-xl border-transparent bg-white pl-10 shadow-[0_8px_24px_-20px_rgba(23,23,34,0.28)] focus-visible:border-[var(--marketing-action)] focus-visible:ring-[var(--marketing-action)]/15"
          placeholder="Search issues..."
          type="search"
        />
      </label>
      <div className="ml-auto flex items-center gap-4">
        <Button
          aria-label="Notifications"
          className="relative bg-card"
          size="icon"
          variant="outline"
        >
          <BellIcon aria-hidden="true" size={19} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
        </Button>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
