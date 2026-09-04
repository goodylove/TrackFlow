// Configures shared Axios clients for public and authenticated TrackFlow API requests.
import axios from "axios"

import { clientEnv } from "@/config/client-env"
import { useAuthStore } from "@/stores/auth-store"
import { resetClientState } from "@/stores/reset-client-state"

export const AUTH_SESSION_EXPIRED_EVENT = "trackflow:auth-session-expired"

const axiosConfig = {
  baseURL: clientEnv.apiUrl,
  timeout: clientEnv.apiTimeoutMs,
  headers: {
    Accept: "application/json",
  },
}

// Public endpoints should never receive a stale or unrelated bearer token.
export const publicApiClient = axios.create(axiosConfig)

// Protected endpoints automatically receive the active session token.
export const apiClient = axios.create(axiosConfig)

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      resetClientState()

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT))
      }
    }

    return Promise.reject(error)
  }
)
