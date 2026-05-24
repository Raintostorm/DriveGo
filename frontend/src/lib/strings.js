import { vi } from "../content/vi.js"

/**
 * @param {string} key - dot path e.g. "nav.home"
 * @param {Record<string, string>} [vars]
 */
export function t(key, vars) {
  const parts = key.split(".")
  let value = vi
  for (const part of parts) {
    if (value == null || typeof value !== "object") return key
    value = value[part]
  }
  if (typeof value !== "string") return key
  if (!vars) return value
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{${k}}`, v),
    value,
  )
}
