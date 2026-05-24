import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

const plans = [
  { name: "Bằng A1", price: "799.000đ", features: ["Lý thuyết tiếng Việt", "Thi thử 24/7", "Hỗ trợ 1-1"] },
  { name: "Bằng A2", price: "1.500.000đ", features: ["Lý thuyết & thực hành", "450+ video", "Hỗ trợ trung tâm"] },
  { name: "Bằng B1", price: "12.000.000đ", features: ["Lý thuyết & mô phỏng", "Lịch học linh hoạt", "Hỗ trợ đến khi đỗ"] },
  {
    name: "Bằng B2",
    price: "15.000.000đ",
    featured: true,
    features: ["Lái xe sân", "Thống kê tiến độ", "Ưu tiên lịch thi"],
  },
]

export function PricingPage() {
  return (
    <section className="space-y-10">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-white">
          {t("pages.pricing.title")}{" "}
          <span className="text-drive-action">{t("pages.pricing.titleHighlight")}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-drive-muted">{t("pages.pricing.subtitle")}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-4">
        {plans.map((plan) => (
          <UiCard
            key={plan.name}
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
            <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold text-white">{plan.price}</p>
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
