import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { SocialAuthButtons } from "../components/SocialAuthButtons.jsx"
import { TextField } from "../components/TextField.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { dashboardPathForRole, isStaffRole, isStudentAppPath } from "../lib/roles.js"
import { t } from "../lib/strings.js"

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function redirectAfterAuth(user) {
    const from = location.state?.from
    const staff = isStaffRole(user.role)
    let target = dashboardPathForRole(user.role)
    if (
      from &&
      from !== "/login" &&
      from !== "/register" &&
      !(staff && isStudentAppPath(from))
    ) {
      target = from
    }
    navigate(target, { replace: true })
  }

  async function handleGoogleSuccess(idToken) {
    setError(null)
    setSubmitting(true)
    try {
      const user = await loginWithGoogle(idToken)
      redirectAfterAuth(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập Google thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const user = await login(email.trim(), password)
      redirectAfterAuth(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <UiCard padding="lg" className="w-full max-w-[440px]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t("pages.login.title")}</h1>
        <p className="mt-2 text-sm text-drive-muted">{t("pages.login.subtitle")}</p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error ? (
          <p className="rounded-drive border border-drive-danger/40 bg-drive-danger/10 px-4 py-3 text-sm text-drive-danger">
            {error}
          </p>
        ) : null}
        <TextField
          id="loginEmail"
          label={t("pages.login.email")}
          type="email"
          placeholder={t("pages.login.emailPlaceholder")}
          icon="✉"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <TextField
          id="loginPassword"
          label={t("pages.login.password")}
          type="password"
          placeholder={t("pages.login.passwordPlaceholder")}
          icon="🔒"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
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
        <PrimaryButton type="submit" fullWidth disabled={submitting}>
          {submitting ? "Đang đăng nhập…" : t("pages.login.submit")}
        </PrimaryButton>
        <SocialAuthButtons onGoogleSuccess={handleGoogleSuccess} disabled={submitting} />
      </form>
    </UiCard>
  )
}
