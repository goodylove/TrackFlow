// Isolates the owner-only destructive workspace action from routine settings.
import { TrashIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

type WorkspaceDangerZoneProps = {
  onDelete: () => void;
  workspaceName: string;
};

export function WorkspaceDangerZone({
  onDelete,
  workspaceName,
}: WorkspaceDangerZoneProps) {
  return (
    <section
      aria-labelledby="workspace-danger-zone-title"
      className="rounded-2xl border border-destructive/25 bg-white px-5 py-5 sm:px-7 sm:py-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            className="text-sm font-black text-destructive"
            id="workspace-danger-zone-title"
          >
            Danger zone
          </p>
          <h2 className="mt-1 text-base font-black">Delete this workspace</h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
            Permanently remove {workspaceName} and revoke workspace access for
            every member.
          </p>
        </div>
        <Button
          className="h-10 shrink-0 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/5"
          onClick={onDelete}
          type="button"
          variant="outline"
        >
          <TrashIcon aria-hidden="true" size={17} weight="bold" />
          Delete workspace
        </Button>
      </div>
    </section>
  );
}
