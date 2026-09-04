const DEFAULT_API_URL = "http://localhost:5000/api/v1"
const DEFAULT_API_TIMEOUT_MS = 15_000

function resolveApiUrl() {
  const value = import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL

  try {
    const url = new URL(value)

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("unsupported protocol")
    }

    return url.toString().replace(/\/$/, "")
  } catch {
    throw new Error("VITE_API_URL must be a valid HTTP or HTTPS URL")
  }
}

function resolveApiTimeout() {
  const value = import.meta.env.VITE_API_TIMEOUT_MS
  if (!value) return DEFAULT_API_TIMEOUT_MS

  const timeout = Number(value)

  if (!Number.isInteger(timeout) || timeout < 1_000 || timeout > 60_000) {
    throw new Error("VITE_API_TIMEOUT_MS must be between 1000 and 60000")
  }

  return timeout
}

export const clientEnv = Object.freeze({
  apiUrl: resolveApiUrl(),
  apiTimeoutMs: resolveApiTimeout(),
})
