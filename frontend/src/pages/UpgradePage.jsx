import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { TextField } from "../components/TextField.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

export function UpgradePage() {
  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-white">
          {t("pages.upgrade.title")}{" "}
          <span className="text-drive-action">{t("pages.upgrade.titleHighlight")}</span>
        </h1>
        <p className="mt-2 text-drive-muted">{t("pages.upgrade.subtitle")}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <UiCard variant="panel">
          <p className="text-sm text-drive-muted">{t("pages.upgrade.free")}</p>
          <p className="text-4xl font-bold text-white">0đ/tháng</p>
          <ul className="mt-4 space-y-2 text-sm text-drive-muted">
            <li>
              <span className="text-drive-success">✓</span> 10 đề thi cơ bản
            </li>
            <li>
              <span className="text-drive-success">✓</span> Lưu kết quả gần nhất
            </li>
          </ul>
        </UiCard>
        <UiCard
          variant="panel"
          className="border-drive-action/50 bg-gradient-to-b from-drive-action/20 to-drive-panel"
        >
          <p className="text-sm font-medium text-drive-action">{t("pages.upgrade.premium")}</p>
          <p className="text-4xl font-bold text-white">199k/tháng</p>
          <PrimaryButton variant="action" className="mt-4">
            {t("pages.upgrade.upgradeNow")}
          </PrimaryButton>
        </UiCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UiCard variant="panel">
          <h2 className="font-semibold text-white">Thông tin khách hàng</h2>
          <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
            <TextField id="custName" label="Họ và tên" placeholder="Nguyễn Văn A" />
            <TextField id="custEmail" label="Email" type="email" />
          </form>
        </UiCard>
        <UiCard variant="panel">
          <h2 className="font-semibold text-white">{t("pages.upgrade.paymentTitle")}</h2>
          <div className="mt-4 space-y-2">
            {["Chuyển khoản (QR)", "Ví Momo/ZaloPay", "Thẻ tín dụng"].map((m, i) => (
              <div
                key={m}
                className={`rounded-drive border p-3 text-sm ${
                  i === 0
                    ? "border-drive-action bg-drive-action/10 text-drive-text"
                    : "border-drive-border text-drive-muted"
                }`}
              >
                {m}
              </div>
            ))}
          </div>
          <p className="mt-6 text-2xl font-bold text-white">199.000đ</p>
          <PrimaryButton variant="action" fullWidth className="mt-4">
            {t("pages.upgrade.paySecure")}
          </PrimaryButton>
        </UiCard>
      </div>
    </section>
  )
}
