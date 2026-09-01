export type AuthUser = {
  id: string
  name: string
  email: string
  token?: string
}

type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
}

export class AuthApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthApiError"
  }
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1"

async function request<T>(path: string, body: Record<string, string>) {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {
    throw new AuthApiError("We could not reach TrackFlow. Please try again.")
  }

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok || !payload?.success || !payload.data) {
    throw new AuthApiError(payload?.message ?? "Something went wrong. Please try again.")
  }

  return payload.data
}

export function loginUser(input: { email: string; password: string }) {
  return request<{ user: AuthUser }>("/users/login", input)
}

export function registerUser(input: { name: string; email: string; password: string }) {
  return request<{ user: AuthUser }>("/users/register", input)
}
