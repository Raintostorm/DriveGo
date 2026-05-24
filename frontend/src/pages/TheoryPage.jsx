import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

const chapters = [
  "Chương 1: Biển báo",
  "Chương 2: Quy tắc",
  "Chương 3: Kỹ thuật lái",
  "Chương 4: Giải đề",
]

export function TheoryPage() {
  return (
    <section className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <UiCard padding="lg" variant="panel">
          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {t("pages.theory.title")}{" "}
            <span className="text-drive-action">{t("pages.theory.titleHighlight")}</span>
          </h1>
          <p className="mt-4 text-drive-muted">{t("pages.theory.subtitle")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton variant="action">{t("pages.theory.startNow")}</PrimaryButton>
            <PrimaryButton variant="outline">Xem lộ trình</PrimaryButton>
          </div>
        </UiCard>
        <UiCard variant="panel">
          <p className="text-sm text-drive-muted">Bài học hiện tại</p>
          <div className="mt-4 h-36 rounded-drive bg-gradient-to-r from-drive-panel to-drive-action/20" />
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-drive-elevated">
            <div className="h-full w-1/2 rounded-full bg-drive-action" />
          </div>
        </UiCard>
      </div>

      <UiCard variant="panel">
        <h2 className="text-xl font-semibold text-white">{t("pages.theory.roadmap")}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {chapters.map((title) => (
            <div
              key={title}
              className="rounded-drive border border-drive-border-soft bg-drive-sidebar p-4"
            >
              <p className="font-semibold text-white">{title}</p>
              <p className="mt-1 text-xs text-drive-muted">35–50 phút</p>
            </div>
          ))}
        </div>
      </UiCard>
    </section>
  )
}
