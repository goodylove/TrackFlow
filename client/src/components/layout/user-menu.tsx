// Provides shared profile and logout actions for dashboard navigation surfaces.
import { GearIcon, SignOutIcon, UserCircleIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/feature/dashboard/dashboard-utils";
import { resetClientState } from "@/stores/reset-client-state";

type UserMenuProps = {
  user: { name: string; email: string };
  compact?: boolean;
};

export function UserMenu({ user, compact = false }: UserMenuProps) {
  const navigate = useNavigate();
  function logout() {
    resetClientState();
    navigate("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Open user menu"
            className="flex min-w-0 items-center gap-2 rounded-xl p-1.5 text-left transition-colors hover:bg-muted"
            type="button"
          />
        }
      >
        <Avatar>
          <AvatarFallback className="bg-[var(--marketing-action)]/95 text-white">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        {!compact ? (
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-xs font-bold">
              {user.name}
            </span>
            <span className="block truncate text-[0.65rem] text-muted-foreground">
              {user.email}
            </span>
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block text-foreground">{user.name}</span>
            <span className="mt-0.5 block font-normal">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserCircleIcon aria-hidden="true" size={17} />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GearIcon aria-hidden="true" size={17} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10"
          onClick={logout}
        >
          <SignOutIcon aria-hidden="true" size={17} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
