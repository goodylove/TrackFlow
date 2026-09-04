// Stores only the selected workspace ID; workspace records remain in the API cache.
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type WorkspaceStore = {
  selectedWorkspaceId: string | null
  selectWorkspace: (workspaceId: string) => void
  clearSelectedWorkspace: () => void
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      selectedWorkspaceId: null,
      selectWorkspace: (selectedWorkspaceId) => set({ selectedWorkspaceId }),
      clearSelectedWorkspace: () => set({ selectedWorkspaceId: null }),
    }),
    {
      name: "trackflow.workspace-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ selectedWorkspaceId }) => ({ selectedWorkspaceId }),
      version: 1,
    }
  )
)
