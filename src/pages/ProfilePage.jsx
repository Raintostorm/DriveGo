import { PageHeader } from "../components/PageHeader.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { StatusBadge } from "../components/StatusBadge.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

const activity = [
  { exam: "Đề thi số 15 - B2", time: "15/10/2023", result: "Đạt (32/35)", pass: true },
  { exam: "Đề thi số 14 - B2", time: "14/10/2023", result: "Không đạt (28/35)", pass: false },
]

export function ProfilePage() {
  return (
    <section className="space-y-6">
      <PageHeader title={t("pages.profile.title")} subtitle={t("pages.profile.subtitle")} />

      <UiCard variant="panel">
        <div className="grid gap-6 sm:grid-cols-[120px_1fr_auto]">
          <div className="flex size-28 items-center justify-center rounded-2xl border border-drive-border bg-drive-sidebar text-4xl">
            👤
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Nguyễn Văn A</h2>
            <p className="text-drive-muted">Học viên hạng B2 · Premium</p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p className="text-drive-text">Email: nguyenvana@example.com</p>
              <p className="text-drive-text">Điện thoại: 0912 345 678</p>
              <p className="text-drive-text">Tham gia: 12/10/2023</p>
              <StatusBadge tone="success">{t("pages.profile.active")}</StatusBadge>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <PrimaryButton variant="outline">{t("common.edit")}</PrimaryButton>
            <PrimaryButton variant="action">{t("pages.profile.changePassword")}</PrimaryButton>
          </div>
        </div>
      </UiCard>

      <UiCard variant="panel">
        <div className="mb-4 flex justify-between">
          <h3 className="font-semibold text-white">{t("pages.profile.recentActivity")}</h3>
          <button type="button" className="text-sm font-medium text-drive-action hover:underline">
            {t("common.viewAll")}
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-drive-muted">
            <tr>
              <th className="pb-2">Bài thi</th>
              <th>Thời gian</th>
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((row) => (
              <tr key={row.exam} className="border-t border-drive-border-soft text-drive-text">
                <td className="py-3">{row.exam}</td>
                <td>{row.time}</td>
                <td>
                  <StatusBadge tone={row.pass ? "success" : "danger"}>{row.result}</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </UiCard>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["24h", "Tổng giờ học"],
          ["85%", "Tiến độ khóa học"],
          ["15", "Bài thi đã làm"],
        ].map(([v, l]) => (
          <UiCard key={l} variant="panel" className="text-center">
            <p className="text-2xl font-bold text-white">{v}</p>
            <p className="text-xs text-drive-muted">{l}</p>
          </UiCard>
        ))}
      </div>
    </section>
  )
}
