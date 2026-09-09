// Renders the shared dashboard context, mobile navigation trigger, and account actions.
import { ListIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState(
    () => new URLSearchParams(location.search).get("search") ?? "",
  );

  useEffect(() => {
    setQuery(new URLSearchParams(location.search).get("search") ?? "");
  }, [location.search]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const search = query.trim();
    navigate(search ? `/dashboard/issues?search=${encodeURIComponent(search)}` : "/dashboard/issues");
  }

  return (
    <header className="sticky top-0 z-30 flex h-[4.5rem] items-center gap-3 border-b border-[var(--marketing-border)] bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8 xl:px-10">
      <Button
        aria-label="Open navigation"
        className="size-11 shrink-0 bg-white lg:hidden"
        onClick={onOpenNavigation}
        size="icon"
        variant="outline"
      >
        <ListIcon aria-hidden="true" size={20} />
      </Button>
      <form className="relative min-w-0 flex-1 md:max-w-xl" onSubmit={handleSearch} role="search">
        <label className="block">
          <span className="sr-only">Search issues</span>
          <Input
            className="h-11 rounded-xl border-[var(--marketing-border)] bg-[var(--marketing-bg)] pl-11 shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-[var(--marketing-action)] focus-visible:bg-white focus-visible:ring-[var(--marketing-action)]/15"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search issues..."
            type="search"
            value={query}
          />
        </label>
        <button
          aria-label="Search issues"
          className="absolute left-0 top-0 flex size-11 items-center justify-center rounded-l-xl text-muted-foreground transition-colors hover:text-[var(--marketing-action)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--marketing-action)]/25"
          type="submit"
        >
          <MagnifyingGlassIcon aria-hidden="true" size={17} />
        </button>
      </form>
      <div className="ml-auto flex min-w-0 items-center">
        <UserMenu user={user} />
      </div>
    </header>
  );
}
