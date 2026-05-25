import { AuthGate } from "./AuthGate.jsx"
import { AuthLayout } from "./layouts/AuthLayout.jsx"
import { AdminLayout } from "./layouts/AdminLayout.jsx"
import { MarketingLayout } from "./layouts/MarketingLayout.jsx"
import { StudentLayout } from "./layouts/StudentLayout.jsx"

/**
 * @param {{ layout: 'marketing' | 'auth' | 'dashboard' | 'admin', children: import('react').ReactNode }} props
 */
export function RouteLayout({ layout, children }) {
  return (
    <AuthGate layout={layout}>
      {layout === "auth" ? (
        <AuthLayout>{children}</AuthLayout>
      ) : layout === "dashboard" ? (
        <StudentLayout>{children}</StudentLayout>
      ) : layout === "admin" ? (
        <AdminLayout>{children}</AdminLayout>
      ) : (
        <MarketingLayout>{children}</MarketingLayout>
      )}
    </AuthGate>
  )
}
