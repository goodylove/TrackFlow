// Holds non-sensitive user state; the JWT lives only in the server-managed cookie.
import { create } from "zustand"

export type AuthSessionUser = {
  id: string
  name: string
  email: string
}

type AuthStore = {
  status: "loading" | "authenticated" | "unauthenticated"
  currentUser: AuthSessionUser | null
  setCurrentUser: (user: AuthSessionUser) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  status: "loading",
  currentUser: null,
  setCurrentUser: (currentUser) =>
    set({ status: "authenticated", currentUser }),
  clearSession: () => set({ status: "unauthenticated", currentUser: null }),
}))
