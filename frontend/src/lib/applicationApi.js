/**
 * Unwrap application from API responses.
 * GET /applications/me may return { application: null, examEligible } — must not
 * treat the wrapper object as an application record.
 * @param {unknown} data
 * @returns {Record<string, unknown> | null}
 */
export function unwrapApplication(data) {
  if (!data || typeof data !== "object") return null

  const candidate =
    "application" in data ? /** @type {{ application?: unknown }} */ (data).application : data

  if (!candidate || typeof candidate !== "object") return null

  const id = /** @type {{ id?: unknown }} */ (candidate).id
  if (typeof id !== "string" || !id) return null

  return /** @type {Record<string, unknown>} */ (candidate)
}
