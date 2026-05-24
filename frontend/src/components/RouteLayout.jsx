import { AuthLayout } from "./layouts/AuthLayout.jsx"
import { DashboardLayout } from "./layouts/DashboardLayout.jsx"
import { MarketingLayout } from "./layouts/MarketingLayout.jsx"

/**
 * @param {{ layout: 'marketing' | 'auth' | 'dashboard' | 'admin', children: import('react').ReactNode }} props
 */
export function RouteLayout({ layout, children }) {
  if (layout === "auth") return <AuthLayout>{children}</AuthLayout>
  if (layout === "dashboard") return <DashboardLayout variant="student">{children}</DashboardLayout>
  if (layout === "admin") return <DashboardLayout variant="admin">{children}</DashboardLayout>
  return <MarketingLayout>{children}</MarketingLayout>
}
