import { Link } from "react-router-dom"
import { BrandLogo } from "../BrandLogo.jsx"
import { PrimaryButton } from "../PrimaryButton.jsx"
import { SidebarNav } from "../SidebarNav.jsx"
import { t } from "../../lib/strings.js"

const studentNav = [
  { to: "/student-dashboard", labelKey: "nav.studentDashboard" },
  { to: "/theory", labelKey: "nav.theory" },
  { to: "/exam", labelKey: "nav.exam" },
  { to: "/history", labelKey: "nav.history" },
  { to: "/schedule", labelKey: "nav.schedule" },
  { to: "/study-calendar", labelKey: "nav.studyCalendar" },
  { to: "/profile", labelKey: "nav.profile" },
  { to: "/notifications", labelKey: "nav.notifications" },
  { to: "/upgrade", labelKey: "nav.upgrade" },
  { to: "/ai-chat", labelKey: "nav.aiChat" },
]

const adminNav = [
  { to: "/admin-dashboard", labelKey: "nav.adminDashboard" },
  { to: "/center-register", labelKey: "nav.centerRegister" },
]

/**
 * @param {{ children: import('react').ReactNode, variant?: 'student' | 'admin' }} props
 */
export function DashboardLayout({ children, variant = "student" }) {
  const items = variant === "admin" ? adminNav : studentNav

  return (
    <div className="-mx-4 flex min-h-[calc(100vh-3rem)] flex-col sm:-mx-6 lg:-mx-10 lg:flex-row">
      <div className="border-b border-drive-border-soft bg-drive-sidebar px-4 py-4 lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-72 lg:border-r lg:border-b-0 lg:px-0 lg:py-6">
        <div className="mb-6 hidden px-5 lg:block">
          <BrandLogo />
        </div>
        <Link to="/home" className="mb-4 flex items-center gap-2 px-2 lg:hidden">
          <BrandLogo size="sm" />
        </Link>
        <SidebarNav items={items} />
        <div className="mt-6 px-3">
          <Link to="/upgrade">
            <PrimaryButton variant="action" fullWidth>
              {t("nav.upgrade")} Premium
            </PrimaryButton>
          </Link>
        </div>
      </div>
      <div className="min-w-0 flex-1 lg:pl-72">
        <div className="px-4 py-6 sm:px-6 lg:px-10">{children}</div>
      </div>
    </div>
  )
}
