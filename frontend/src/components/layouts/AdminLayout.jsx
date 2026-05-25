import { useMemo } from "react"
import { useAuth } from "../../context/AuthContext.jsx"
import { navItemsForRole } from "../../config/adminNav.js"
import { DashboardShell } from "./DashboardShell.jsx"

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function AdminLayout({ children }) {
  const { user } = useAuth()
  const navItems = useMemo(
    () => navItemsForRole(user?.role ?? ""),
    [user?.role],
  )

  return (
    <DashboardShell variant="admin" navItems={navItems}>
      {children}
    </DashboardShell>
  )
}
