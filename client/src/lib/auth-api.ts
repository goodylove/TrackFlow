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
  errors?: Partial<Record<"name" | "email" | "password", string[]>>
}

export class AuthApiError extends Error {
  fieldErrors?: Partial<Record<"name" | "email" | "password", string>>

  constructor(
    message: string,
    options?: {
      fieldErrors?: Partial<Record<"name" | "email" | "password", string>>
    }
  ) {
    super(message)
    this.name = "AuthApiError"
    this.fieldErrors = options?.fieldErrors
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
    const fieldErrors = Object.fromEntries(
      Object.entries(payload?.errors ?? {}).flatMap(([field, messages]) =>
        messages?.[0] ? [[field, messages[0]]] : []
      )
    ) as Partial<Record<"name" | "email" | "password", string>>

    if (response.status === 409 && !fieldErrors.email) {
      fieldErrors.email = payload?.message ?? "An account with this email already exists"
    }

    throw new AuthApiError(payload?.message ?? "Something went wrong. Please try again.", {
      fieldErrors,
    })
  }

  return payload.data
}

export function loginUser(input: { email: string; password: string }) {
  return request<{ user: AuthUser }>("/users/login", input)
}

export function registerUser(input: { name: string; email: string; password: string }) {
  return request<{ user: AuthUser }>("/users/register", input)
}
