import { Navigate, useLocation } from "react-router-dom"
import { PageFallback } from "./PageFallback.jsx"
import { useAuth, dashboardPathForRole } from "../context/AuthContext.jsx"

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

  if (isProtected && layout === "admin") {
    const allowed = user.role === "center_admin" || user.role === "system_admin"
    if (!allowed) {
      return <Navigate to="/student-dashboard" replace />
    }
  }

  if (isAuthPage && user) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />
  }

  return children
}
