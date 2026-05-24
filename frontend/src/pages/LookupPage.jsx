import { useState } from "react"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { StatusBadge } from "../components/StatusBadge.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { apiFetch } from "../lib/api.js"
import { t } from "../lib/strings.js"

export function LookupPage() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const data = await apiFetch(`/lookup?code=${encodeURIComponent(code.trim())}`)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tra cứu thất bại")
    } finally {
      setLoading(false)
    }
  }

  const passed = result?.resultStatus?.toLowerCase().includes("đạt")

  return (
    <section className="space-y-8">
      <UiCard as="header" padding="lg" variant="panel" className="text-center">
        <h1 className="text-4xl font-bold text-white">
          {t("pages.lookup.title")}{" "}
          <span className="text-drive-action">{t("pages.lookup.titleHighlight")}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-drive-muted">{t("pages.lookup.subtitle")}</p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t("pages.lookup.placeholder")}
            className="flex-1 rounded-drive-pill border border-drive-border bg-drive-elevated px-4 py-3 text-drive-text outline-none focus:ring-2 focus:ring-drive-accent"
          />
          <PrimaryButton type="submit" variant="action" disabled={loading || !code.trim()}>
            {loading ? "Đang tra cứu…" : t("pages.lookup.submit")}
          </PrimaryButton>
        </form>
      </UiCard>

      {error ? (
        <UiCard variant="panel">
          <p className="text-sm text-drive-danger">{error}</p>
        </UiCard>
      ) : null}

      {result ? (
        <UiCard variant="panel">
          <h2 className="text-xl font-semibold text-white">{t("pages.lookup.resultTitle")}</h2>
          <div className="mt-4 rounded-drive border border-drive-border-soft bg-drive-sidebar p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{result.studentName}</p>
                <p className="text-sm text-drive-muted">Mã: {result.code}</p>
              </div>
              <StatusBadge tone={passed ? "success" : "danger"}>
                {result.resultStatus || t("pages.lookup.passed")}
              </StatusBadge>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-drive-muted sm:grid-cols-2">
              <p>Hạng: {result.licenseClass}</p>
              <p>Cập nhật: {new Date(result.updatedAt).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>
        </UiCard>
      ) : null}
    </section>
  )
}
