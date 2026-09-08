const LEGACY_AUTH_KEYS = ["trackflow.auth.token", "trackflow.auth.user"] as const

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

// Remove credentials created by versions that stored the JWT in Web Storage.
export function clearLegacyAuthSession() {
  for (const storage of availableStorages()) {
    try {
      for (const key of LEGACY_AUTH_KEYS) storage.removeItem(key)
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }
}
