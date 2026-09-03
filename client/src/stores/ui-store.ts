// Holds persistent UI preferences that are shared across unrelated components.
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type ThemePreference = "light" | "dark" | "system"

type UiStore = {
  isSidebarCollapsed: boolean
  theme: ThemePreference
  setSidebarCollapsed: (isSidebarCollapsed: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: ThemePreference) => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      theme: "system",
      setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "trackflow.ui-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ isSidebarCollapsed, theme }) => ({
        isSidebarCollapsed,
        theme,
      }),
      version: 1,
    }
  )
)
