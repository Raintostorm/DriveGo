import { Link } from "react-router-dom"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { SocialAuthButtons } from "../components/SocialAuthButtons.jsx"
import { TextField } from "../components/TextField.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

export function RegisterPage() {
  return (
    <UiCard padding="lg" className="w-full max-w-[440px]">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t("pages.register.title")}</h1>
        <p className="mt-2 text-sm text-drive-muted">{t("pages.register.subtitle")}</p>
      </div>

      <div className="mb-6 grid grid-cols-2 rounded-drive-pill border border-drive-border bg-drive-elevated p-1 text-center text-sm">
        <button type="button" className="rounded-drive-pill bg-drive-accent py-2.5 font-bold text-white">
          {t("pages.register.tabStudent")}
        </button>
        <Link
          to="/center-register"
          className="flex items-center justify-center rounded-drive-pill py-2.5 font-medium text-drive-muted hover:text-white"
        >
          {t("pages.register.tabCenter")}
        </Link>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <TextField id="fullName" label={t("pages.register.fullName")} placeholder="Nguyễn Văn A" icon="👤" />
        <TextField
          id="email"
          label={t("pages.register.email")}
          type="email"
          placeholder={t("pages.login.emailPlaceholder")}
          icon="✉"
        />
        <TextField
          id="password"
          label={t("pages.register.password")}
          type="password"
          placeholder="Tối thiểu 8 ký tự"
          icon="🔒"
        />
        <TextField
          id="confirmPassword"
          label={t("pages.register.confirmPassword")}
          type="password"
          placeholder="Nhập lại mật khẩu"
          icon="🔒"
        />
        <PrimaryButton type="submit" fullWidth>
          {t("pages.register.submit")}
        </PrimaryButton>
        <SocialAuthButtons />
      </form>
    </UiCard>
  )
}
