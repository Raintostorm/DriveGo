import { useEffect, useState } from "react"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { apiFetch } from "../lib/api.js"
import { t } from "../lib/strings.js"

export function PricingPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch("/plans")
      .then((data) => setPlans(data.licenseClasses ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-10">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-white">
          {t("pages.pricing.title")}{" "}
          <span className="text-drive-action">{t("pages.pricing.titleHighlight")}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-drive-muted">{t("pages.pricing.subtitle")}</p>
      </header>

      {loading ? (
        <p className="text-center text-drive-muted">Đang tải bảng giá…</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {plans.map((plan) => (
            <UiCard
              key={plan.code}
              variant="panel"
              className={
                plan.featured
                  ? "border-drive-action/50 bg-gradient-to-b from-drive-action/20 to-drive-panel"
                  : ""
              }
            >
              {plan.featured ? (
                <span className="mb-2 inline-block rounded-full bg-drive-action px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  {t("pages.pricing.popular")}
                </span>
              ) : null}
              <h2 className="text-xl font-semibold text-white">Bằng {plan.code}</h2>
              <p className="mt-2 text-3xl font-bold text-white">{plan.price}</p>
              <p className="mt-1 text-xs text-drive-muted">{plan.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-drive-muted">
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className="text-drive-success">✓</span> {f}
                  </li>
                ))}
              </ul>
              <PrimaryButton variant="action" fullWidth className="mt-6">
                {t("common.registerNow")}
              </PrimaryButton>
            </UiCard>
          ))}
        </div>
      )}

      <UiCard variant="panel">
        <h2 className="font-semibold text-white">{t("pages.pricing.consultTitle")}</h2>
        <p className="mt-2 text-drive-muted">{t("pages.pricing.consultSubtitle")}</p>
        <input
          type="tel"
          placeholder="0912 xxx xxx"
          className="mt-4 w-full max-w-md rounded-drive-pill border border-drive-border bg-drive-elevated px-4 py-3 text-drive-text outline-none focus:ring-2 focus:ring-drive-accent"
        />
      </UiCard>
    </section>
  )
}
