const AUTH_TOKEN_KEY = "trackflow.auth.token"
const AUTH_USER_KEY = "trackflow.auth.user"

export type AuthSessionUser = {
  id: string
  name: string
  email: string
}

function availableStorages() {
  if (typeof window === "undefined") return []

  const storages: Storage[] = []

  try {
    storages.push(window.sessionStorage)
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }

  try {
    storages.push(window.localStorage)
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }

  return storages
}

function readStorage(storage: Storage, key: string) {
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

function parseUser(value: string | null): AuthSessionUser | null {
  if (!value) return null

  try {
    const user = JSON.parse(value) as Partial<AuthSessionUser>

    if (
      typeof user.id !== "string" ||
      typeof user.name !== "string" ||
      typeof user.email !== "string"
    ) {
      return null
    }

    return { id: user.id, name: user.name, email: user.email }
  } catch {
    return null
  }
}

export function getAuthSession() {
  for (const storage of availableStorages()) {
    const token = readStorage(storage, AUTH_TOKEN_KEY)
    const user = parseUser(readStorage(storage, AUTH_USER_KEY))

    if (token && user) return { token, user }
  }

  return null
}

export function getAuthToken() {
  return getAuthSession()?.token ?? null
}

export function saveAuthSession(
  token: string,
  user: AuthSessionUser,
  remember: boolean
) {
  if (typeof window === "undefined") return

  clearAuthSession()

  let storage: Storage

  try {
    storage = remember ? window.localStorage : window.sessionStorage
  } catch {
    throw new Error("Browser storage is unavailable")
  }

  try {
    storage.setItem(AUTH_TOKEN_KEY, token)
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  } catch {
    try {
      storage.removeItem(AUTH_TOKEN_KEY)
      storage.removeItem(AUTH_USER_KEY)
    } catch {
      // Keep the original storage failure as the error shown to the caller.
    }

    throw new Error("The browser could not save the authentication session")
  }
}

export function clearAuthSession() {
  for (const storage of availableStorages()) {
    try {
      storage.removeItem(AUTH_TOKEN_KEY)
      storage.removeItem(AUTH_USER_KEY)
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }
}
