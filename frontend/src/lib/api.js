const DEFAULT_API_URL = "http://localhost:3000/api"

export const apiBaseUrl = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, "")

/**
 * @param {string} path
 * @param {RequestInit} [options]
 */
export async function apiFetch(path, options = {}) {
  const url = `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || response.statusText || "Request failed"
    throw new Error(message)
  }

  return data
}
