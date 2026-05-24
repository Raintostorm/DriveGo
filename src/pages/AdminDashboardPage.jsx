import { PageHeader } from "../components/PageHeader.jsx"
import { StatCard } from "../components/StatCard.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

export function AdminDashboardPage() {
  return (
    <section>
      <PageHeader title={t("pages.adminDashboard.title")} subtitle="Trung tâm Đào tạo · DriveGo" />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tổng học viên", "1,250"],
          ["Đang học", "840"],
          ["Số lớp", "32"],
          ["Doanh thu tháng", "850M"],
        ].map(([label, value]) => (
          <StatCard key={label} label={label} value={value} badge="+12%" />
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <UiCard variant="panel" className="h-56">
          <p className="font-semibold text-white">Học viên mới theo tháng</p>
          <div className="mt-6 flex h-36 items-end gap-2">
            {[35, 54, 41, 66, 75, 58, 90].map((h) => (
              <div
                key={h}
                className="flex-1 rounded-t bg-drive-action/60"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </UiCard>
        <UiCard variant="panel">
          <p className="font-semibold text-white">Tỷ lệ đỗ sát hạch</p>
          <p className="mt-6 text-5xl font-bold text-drive-action">85%</p>
          <p className="text-sm text-drive-muted">+3.5% so với tháng trước</p>
        </UiCard>
      </div>
    </section>
  )
}
