import { useEffect, type ReactNode } from "react"

import { getCurrentUser } from "@/feature/auth/services/auth-service"
import { clearLegacyAuthSession } from "@/lib/auth-session"
import { useAuthStore } from "@/stores/auth-store"

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser)
  const clearSession = useAuthStore((state) => state.clearSession)

  useEffect(() => {
    let active = true

    clearLegacyAuthSession()

    void getCurrentUser()
      .then((user) => {
        if (active) setCurrentUser(user)
      })
      .catch(() => {
        if (active) clearSession()
      })

    return () => {
      active = false
    }
  }, [clearSession, setCurrentUser])

  return children
}
