// Controls access to authenticated and signed-out routes using the existing auth store.
import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

import { useAuthStore } from "@/stores/auth-store"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const currentUser = useAuthStore((state) => state.currentUser)
  const location = useLocation()

  if (!token || !currentUser) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate replace to={`/login?redirect=${redirect}`} />
  }

  return children
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token)
  const currentUser = useAuthStore((state) => state.currentUser)

  if (token && currentUser) {
    return <Navigate replace to="/dashboard" />
  }

  return children
}
