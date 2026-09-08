// Controls access to authenticated and signed-out routes using the existing auth store.
import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

import { useAuthStore } from "@/stores/auth-store"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status)
  const currentUser = useAuthStore((state) => state.currentUser)
  const location = useLocation()

  if (status === "loading") {
    return <div className="grid min-h-screen place-items-center">Checking session...</div>
  }

  if (status !== "authenticated" || !currentUser) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate replace to={`/login?redirect=${redirect}`} />
  }

  return children
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status)

  if (status === "loading") {
    return <div className="grid min-h-screen place-items-center">Checking session...</div>
  }

  if (status === "authenticated") {
    return <Navigate replace to="/dashboard" />
  }

  return children
}
