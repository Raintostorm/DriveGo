import { PageHeader } from "../components/PageHeader.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { StatCard } from "../components/StatCard.jsx"
import { StatusBadge } from "../components/StatusBadge.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

const rows = [
  { date: "14/10/2023", exam: "Đề thi số 08", rank: "B2", score: "34/35", pass: true, time: "18:42" },
  { date: "12/10/2023", exam: "Đề thi thử tập trung", rank: "B2", score: "28/35", pass: false, time: "22:00" },
  { date: "10/10/2023", exam: "Đề thi số 07", rank: "B2", score: "35/35", pass: true, time: "15:10" },
]

export function HistoryPage() {
  return (
    <section>
      <PageHeader title={t("pages.history.title")} subtitle={t("pages.history.subtitle")} />

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label={t("pages.history.totalExams")} value="42" />
            <StatCard label={t("pages.history.passRate")} value="85%" />
            <StatCard label={t("pages.history.bestScore")} value="35/35" />
          </div>

          <UiCard variant="panel" padding="none" className="overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-drive-sidebar text-drive-muted">
                <tr>
                  <th className="px-4 py-3">Ngày</th>
                  <th className="px-4 py-3">Đề thi</th>
                  <th className="px-4 py-3">Hạng</th>
                  <th className="px-4 py-3">Kết quả</th>
                  <th className="px-4 py-3">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.date + row.exam} className="border-t border-drive-border-soft text-drive-text">
                    <td className="px-4 py-3 text-drive-muted">{row.date}</td>
                    <td className="px-4 py-3">{row.exam}</td>
                    <td className="px-4 py-3">{row.rank}</td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={row.pass ? "success" : "danger"}>{row.score}</StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-drive-muted">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </UiCard>
        </div>

        <aside className="space-y-4">
          <UiCard variant="panel">
            <p className="text-sm font-semibold text-white">{t("pages.history.reviewHint")}</p>
            <p className="mt-2 text-xs text-drive-muted">Cần cải thiện: Biển báo đường bộ</p>
            <div className="mt-4 flex h-24 items-end gap-1">
              {[40, 55, 48, 70, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-drive-action/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </UiCard>
          <PrimaryButton variant="action" fullWidth>
            {t("pages.history.startReview")}
          </PrimaryButton>
        </aside>
      </div>
    </section>
  )
}
