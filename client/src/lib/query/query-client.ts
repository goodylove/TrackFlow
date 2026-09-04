// Configures the shared TanStack Query cache and request retry behavior.
import { QueryClient } from "@tanstack/react-query"

import { ApiError } from "@/lib/api/api-error"

const ONE_MINUTE = 60 * 1000
const FIVE_MINUTES = 5 * ONE_MINUTE

function shouldRetryQuery(failureCount: number, error: Error) {
  if (failureCount >= 2) return false

  if (error instanceof ApiError && error.status) {
    const isRetryableStatus = error.status === 408 || error.status === 429 || error.status >= 500
    return isRetryableStatus
  }

  return true
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE,
      gcTime: FIVE_MINUTES,
      retry: shouldRetryQuery,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
})
