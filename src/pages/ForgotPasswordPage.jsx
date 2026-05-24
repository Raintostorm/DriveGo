import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { TextField } from "../components/TextField.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

export function ForgotPasswordPage() {
  return (
    <UiCard padding="lg" className="w-full max-w-[440px]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t("pages.forgotPassword.title")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-drive-muted">{t("pages.forgotPassword.subtitle")}</p>
      </div>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <TextField
          id="forgotEmail"
          label={t("pages.forgotPassword.email")}
          type="email"
          placeholder={t("pages.login.emailPlaceholder")}
          icon="✉"
        />
        <PrimaryButton type="submit" fullWidth>
          {t("pages.forgotPassword.submit")}
        </PrimaryButton>
      </form>
    </UiCard>
  )
}
