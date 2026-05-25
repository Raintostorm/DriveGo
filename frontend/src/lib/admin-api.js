import { apiBaseUrl, apiFetch, apiFetchBlob, getAuthToken } from "./api.js"

export function adminDownloadDocument(documentId, filename) {
  return apiFetchBlob(`/admin/applications/documents/${documentId}/file`).then((blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename || "document"
    a.click()
    URL.revokeObjectURL(url)
  })
}

export function adminOpenDocument(documentId) {
  const token = getAuthToken()
  const url = `${apiBaseUrl}/admin/applications/documents/${documentId}/file`
  window.open(token ? `${url}?token=${encodeURIComponent(token)}` : url, "_blank")
}

export async function fetchAdminSummary() {
  return apiFetch("/admin/dashboard/summary", { auth: true })
}

export async function fetchAdminApplications(params = {}) {
  const q = new URLSearchParams()
  if (params.status) q.set("status", params.status)
  if (params.licenseClass) q.set("licenseClass", params.licenseClass)
  const qs = q.toString()
  return apiFetch(`/admin/applications${qs ? `?${qs}` : ""}`, { auth: true })
}

export async function fetchAdminApplication(id) {
  return apiFetch(`/admin/applications/${id}`, { auth: true })
}

export async function patchAdminApplication(id, body) {
  return apiFetch(`/admin/applications/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(body),
  })
}

export async function fetchAdminRegistrations(params = {}) {
  const q = new URLSearchParams()
  if (params.status) q.set("status", params.status)
  if (params.slotType) q.set("slotType", params.slotType)
  const qs = q.toString()
  return apiFetch(`/admin/registrations${qs ? `?${qs}` : ""}`, { auth: true })
}

export async function patchAdminRegistration(id, body) {
  return apiFetch(`/admin/registrations/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(body),
  })
}

export async function fetchAdminStudents(params = {}) {
  const q = new URLSearchParams()
  if (params.premium) q.set("premium", params.premium)
  if (params.enrolled) q.set("enrolled", params.enrolled)
  if (params.licenseClass) q.set("licenseClass", params.licenseClass)
  const qs = q.toString()
  return apiFetch(`/admin/students${qs ? `?${qs}` : ""}`, { auth: true })
}

export async function requestAdminDossier(applicationId, body = {}) {
  return apiFetch(`/admin/applications/${applicationId}/request-dossier`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  })
}
