import { AuthGate } from "./AuthGate.jsx"
import { AuthLayout } from "./layouts/AuthLayout.jsx"
import { DashboardLayout } from "./layouts/DashboardLayout.jsx"
import { MarketingLayout } from "./layouts/MarketingLayout.jsx"

/**
 * @param {{ layout: 'marketing' | 'auth' | 'dashboard' | 'admin', children: import('react').ReactNode }} props
 */
export function RouteLayout({ layout, children }) {
  return (
    <AuthGate layout={layout}>
      {layout === "auth" ? (
        <AuthLayout>{children}</AuthLayout>
      ) : layout === "dashboard" ? (
        <DashboardLayout variant="student">{children}</DashboardLayout>
      ) : layout === "admin" ? (
        <DashboardLayout variant="admin">{children}</DashboardLayout>
      ) : (
        <MarketingLayout>{children}</MarketingLayout>
      )}
    </AuthGate>
  )
}
