import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { StatusBadge } from "../components/StatusBadge.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

export function LookupPage() {
  return (
    <section className="space-y-8">
      <UiCard as="header" padding="lg" variant="panel" className="text-center">
        <h1 className="text-4xl font-bold text-white">
          {t("pages.lookup.title")}{" "}
          <span className="text-drive-action">{t("pages.lookup.titleHighlight")}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-drive-muted">{t("pages.lookup.subtitle")}</p>
        <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder={t("pages.lookup.placeholder")}
            className="flex-1 rounded-drive-pill border border-drive-border bg-drive-elevated px-4 py-3 text-drive-text outline-none focus:ring-2 focus:ring-drive-accent"
          />
          <PrimaryButton variant="action">{t("pages.lookup.submit")}</PrimaryButton>
        </div>
      </UiCard>

      <UiCard variant="panel">
        <h2 className="text-xl font-semibold text-white">{t("pages.lookup.resultTitle")}</h2>
        <div className="mt-4 rounded-drive border border-drive-border-soft bg-drive-sidebar p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-white">Nguyễn Văn An</p>
              <p className="text-sm text-drive-muted">Mã hồ sơ: 101</p>
            </div>
            <StatusBadge tone="success">{t("pages.lookup.passed")}</StatusBadge>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-drive-muted sm:grid-cols-4">
            <p>Hạng: B2</p>
            <p>Ngày sinh: 15/03/1995</p>
            <p>Khóa: K42/2023</p>
            <p>Thực hành: 95/100</p>
          </div>
        </div>
      </UiCard>
    </section>
  )
}
