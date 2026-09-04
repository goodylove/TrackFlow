// Holds the authenticated user and token while delegating browser persistence to the session helper.
import { create } from "zustand"

import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  type AuthSessionUser,
} from "@/lib/auth-session"

type AuthStore = {
  token: string | null
  currentUser: AuthSessionUser | null
  setSession: (token: string, user: AuthSessionUser, remember: boolean) => void
  clearSession: () => void
}

const initialSession = getAuthSession()

export const useAuthStore = create<AuthStore>()((set) => ({
  token: initialSession?.token ?? null,
  currentUser: initialSession?.user ?? null,
  setSession: (token, user, remember) => {
    saveAuthSession(token, user, remember)
    set({ token, currentUser: user })
  },
  clearSession: () => {
    clearAuthSession()
    set({ token: null, currentUser: null })
  },
}))
