export const STAFF_ROLES = ["center_admin", "system_admin"]

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role)
}

export function isSystemAdmin(role) {
  return role === "system_admin"
}

/** Student-only app routes; staff login should not return here via state.from */
export const STUDENT_APP_PREFIXES = [
  "/student-dashboard",
  "/theory",
  "/exam",
  "/history",
  "/schedule",
  "/study-calendar",
  "/profile",
  "/application",
  "/notifications",
  "/upgrade",
  "/enroll",
  "/ai-chat",
]

export function isStudentAppPath(path) {
  if (!path || path === "/login" || path === "/register") return false
  return STUDENT_APP_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  )
}

export function dashboardPathForRole(role) {
  if (isStaffRole(role)) return "/admin-dashboard"
  return "/student-dashboard"
}
