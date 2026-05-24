import { Link, useLocation } from "react-router-dom"
import { t } from "../../lib/strings.js"

/** @returns {{ prompt: string, linkLabel: string, to: string }} */
function authHeaderCta(pathname) {
  if (pathname === "/register") {
    return {
      prompt: t("pages.register.hasAccount"),
      linkLabel: t("pages.register.login"),
      to: "/login",
    }
  }
  if (pathname === "/forgot-password") {
    return {
      prompt: t("common.backToLogin"),
      linkLabel: t("nav.login"),
      to: "/login",
    }
  }
  return {
    prompt: t("pages.login.noAccount"),
    linkLabel: t("pages.login.signup"),
    to: "/register",
  }
}

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthLayout({ children }) {
  const { pathname } = useLocation()
  const cta = authHeaderCta(pathname)

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 -top-32 size-[600px] rounded-full bg-drive-accent/10 blur-[60px]" />
        <div className="absolute -bottom-32 -right-32 size-[500px] rounded-full bg-drive-action/10 blur-[50px]" />
      </div>

      <header className="relative z-10 flex items-center justify-end px-6 py-6 sm:px-10">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-drive-muted">{cta.prompt}</span>
          <Link to={cta.to} className="font-bold text-drive-accent hover:brightness-110">
            {cta.linkLabel}
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pb-10">
        <div className="w-full max-w-[440px]">{children}</div>
      </div>

      <footer className="relative z-10 flex justify-center gap-6 pb-8 text-xs text-drive-placeholder opacity-80">
        <Link to="/docs" className="hover:text-drive-muted">
          {t("footer.terms")}
        </Link>
        <Link to="/docs" className="hover:text-drive-muted">
          {t("footer.privacy")}
        </Link>
        <span>{t("nav.support")}</span>
      </footer>
    </div>
  )
}
