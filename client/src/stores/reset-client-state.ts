// Clears user-specific client state while preserving device-level UI preferences.
import { useAuthStore } from "@/stores/auth-store"
import { useWorkspaceStore } from "@/stores/workspace-store"

export function resetClientState() {
  useAuthStore.getState().clearSession()
  useWorkspaceStore.getState().clearSelectedWorkspace()
}
