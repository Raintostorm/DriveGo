import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { SocialAuthButtons } from "../components/SocialAuthButtons.jsx"
import { TextField } from "../components/TextField.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { dashboardPathForRole, useAuth } from "../context/AuthContext.jsx"
import { t } from "../lib/strings.js"

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, loginWithGoogle } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleGoogleSuccess(idToken) {
    setError(null)
    setSubmitting(true)
    try {
      const user = await loginWithGoogle(idToken)
      navigate(dashboardPathForRole(user.role), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký Google thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    if (password.length < 8) {
      setError("Mật khẩu tối thiểu 8 ký tự")
      return
    }

    setSubmitting(true)
    try {
      const user = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      })
      navigate(dashboardPathForRole(user.role), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại")
    } finally {
      setSubmitting(false)
    }
  }

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

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <p className="rounded-drive border border-drive-danger/40 bg-drive-danger/10 px-4 py-3 text-sm text-drive-danger">
            {error}
          </p>
        ) : null}
        <TextField
          id="fullName"
          label={t("pages.register.fullName")}
          placeholder="Nguyễn Văn A"
          icon="👤"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />
        <TextField
          id="email"
          label={t("pages.register.email")}
          type="email"
          placeholder={t("pages.login.emailPlaceholder")}
          icon="✉"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <TextField
          id="password"
          label={t("pages.register.password")}
          type="password"
          placeholder="Tối thiểu 8 ký tự"
          icon="🔒"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <TextField
          id="confirmPassword"
          label={t("pages.register.confirmPassword")}
          type="password"
          placeholder="Nhập lại mật khẩu"
          icon="🔒"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <PrimaryButton type="submit" fullWidth disabled={submitting}>
          {submitting ? "Đang đăng ký…" : t("pages.register.submit")}
        </PrimaryButton>
        <SocialAuthButtons onGoogleSuccess={handleGoogleSuccess} disabled={submitting} />
      </form>
    </UiCard>
  )
}
