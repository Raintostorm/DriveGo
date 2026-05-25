import { Navigate, useLocation } from "react-router-dom"
import { PageFallback } from "./PageFallback.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { dashboardPathForRole, isStaffRole } from "../lib/roles.js"

/**
 * @param {{ children: import('react').ReactNode, layout: 'marketing' | 'auth' | 'dashboard' | 'admin' }} props
 */
export function AuthGate({ layout, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <PageFallback />
  }

  const isProtected = layout === "dashboard" || layout === "admin"
  const isAuthPage = layout === "auth"

  if (isProtected && !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (isProtected && user) {
    const staff = isStaffRole(user.role)
    if (layout === "admin" && !staff) {
      return <Navigate to="/student-dashboard" replace />
    }
    if (layout === "dashboard" && staff) {
      return <Navigate to="/admin-dashboard" replace />
    }
  }

  if (isAuthPage && user) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />
  }

  return children
}
