import { Link } from "react-router-dom"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

export function CenterRegisterPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-white">{t("pages.centerRegister.title")}</h1>
        <p className="mt-2 text-drive-muted">{t("pages.centerRegister.subtitle")}</p>
        <div className="mx-auto mt-4 grid max-w-md grid-cols-2 rounded-drive-pill border border-drive-border bg-drive-elevated p-1 text-sm">
          <Link to="/register" className="rounded-drive-pill py-2.5 text-drive-muted hover:text-white">
            {t("pages.register.tabStudent")}
          </Link>
          <span className="rounded-drive-pill bg-drive-accent py-2.5 font-bold text-white">
            {t("pages.register.tabCenter")}
          </span>
        </div>
      </header>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        {[
          ["1", t("pages.centerRegister.section1"), ["Tên trung tâm", "Mã số thuế", "Thành phố", "Địa chỉ"]],
          ["2", t("pages.centerRegister.section2"), ["Họ và tên đại diện", "Số điện thoại", "Email"]],
          ["3", t("pages.centerRegister.section3"), ["Email đăng nhập", "Mật khẩu", "Xác nhận mật khẩu"]],
        ].map(([num, title, fields]) => (
          <UiCard key={num} variant="panel">
            <h2 className="text-lg font-semibold text-white">
              {num}. {title}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                <input
                  key={f}
                  placeholder={f}
                  className="rounded-lg border border-drive-border bg-drive-elevated px-3 py-2.5 text-sm text-drive-text outline-none focus:ring-2 focus:ring-drive-accent"
                />
              ))}
            </div>
          </UiCard>
        ))}
        <PrimaryButton type="submit" variant="action" fullWidth>
          {t("pages.centerRegister.submit")}
        </PrimaryButton>
      </form>
    </section>
  )
}
