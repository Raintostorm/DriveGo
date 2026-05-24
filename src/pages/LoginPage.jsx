import { Link } from "react-router-dom"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { SocialAuthButtons } from "../components/SocialAuthButtons.jsx"
import { TextField } from "../components/TextField.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

export function LoginPage() {
  return (
    <UiCard padding="lg" className="w-full max-w-[440px]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t("pages.login.title")}</h1>
        <p className="mt-2 text-sm text-drive-muted">{t("pages.login.subtitle")}</p>
      </div>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <TextField
          id="loginEmail"
          label={t("pages.login.email")}
          type="email"
          placeholder={t("pages.login.emailPlaceholder")}
          icon="✉"
        />
        <TextField
          id="loginPassword"
          label={t("pages.login.password")}
          type="password"
          placeholder={t("pages.login.passwordPlaceholder")}
          icon="🔒"
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-3 text-drive-label">
            <input
              type="checkbox"
              className="size-5 rounded-lg border border-drive-border bg-transparent"
            />
            {t("pages.login.remember")}
          </label>
          <Link to="/forgot-password" className="font-bold text-drive-accent hover:brightness-110">
            {t("pages.login.forgot")}
          </Link>
        </div>
        <PrimaryButton type="submit" fullWidth>
          {t("pages.login.submit")}
        </PrimaryButton>
        <SocialAuthButtons />
      </form>
    </UiCard>
  )
}
