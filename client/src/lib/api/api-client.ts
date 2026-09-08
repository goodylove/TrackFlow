// Configures shared Axios clients for public and authenticated TrackFlow API requests.
import axios from "axios"

import { clientEnv } from "@/config/client-env"
import { resetClientState } from "@/stores/reset-client-state"

export const AUTH_SESSION_EXPIRED_EVENT = "trackflow:auth-session-expired"

const axiosConfig = {
  baseURL: clientEnv.apiUrl,
  timeout: clientEnv.apiTimeoutMs,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
}

// Both clients allow the browser to send the httpOnly session cookie.
export const publicApiClient = axios.create(axiosConfig)

export const apiClient = axios.create(axiosConfig)

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
