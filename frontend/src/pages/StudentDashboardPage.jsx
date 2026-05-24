import { Link } from "react-router-dom"
import { PageHeader } from "../components/PageHeader.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { StatCard } from "../components/StatCard.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

const quickStats = [
  { labelKey: "pages.studentDashboard.statProgress", value: "45%", badge: "+5% tuần này" },
  { labelKey: "pages.studentDashboard.statSessions", value: "12/30", badge: "+2 bài mới" },
  { labelKey: "pages.studentDashboard.statScore", value: "8.5/10", badge: "Ổn định" },
  { labelKey: "pages.studentDashboard.statStatus", value: "Premium", badge: "Đang hoạt động" },
]

export function StudentDashboardPage() {
  return (
    <section>
      <PageHeader
        title={t("pages.studentDashboard.title")}
        subtitle="Chào Minh Tuấn, hôm nay bạn đã sẵn sàng lái xe chưa?"
        actions={
          <>
            <span className="rounded-lg border border-drive-border-soft bg-drive-panel px-4 py-2 text-sm text-drive-text">
              Thứ 6, 24 Tháng 5
            </span>
            <Link
              to="/notifications"
              className="relative rounded-lg border border-drive-border-soft bg-drive-panel p-2.5 text-drive-muted hover:text-white"
            >
              🔔
              <span className="absolute right-2 top-2 size-2 rounded-full bg-drive-danger" />
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickStats.map(({ labelKey, value, badge }) => (
          <StatCard key={labelKey} label={t(labelKey)} value={value} badge={badge} />
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <UiCard variant="panel" as="article" padding="lg">
          <p className="text-xs font-medium text-drive-action">{t("pages.studentDashboard.currentLesson")}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Chương 3: Biển báo hiệu đường bộ</h2>
          <div className="mt-6 rounded-drive border border-drive-border-soft bg-drive-sidebar p-4">
            <div className="h-2.5 overflow-hidden rounded-full bg-drive-elevated">
              <div className="h-full w-[45%] rounded-full bg-drive-action shadow-drive-action" />
            </div>
            <p className="mt-3 text-xs text-drive-muted">Tiến độ: 12/25 bài học</p>
          </div>
          <PrimaryButton variant="action" className="mt-6">
            {t("pages.studentDashboard.continue")}
          </PrimaryButton>
        </UiCard>
        <UiCard variant="panel" as="article">
          <h3 className="font-semibold text-white">{t("pages.studentDashboard.reviewTips")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-drive-muted">
            <li>• Quy tắc giao thông cơ bản</li>
            <li>• Biển báo nguy hiểm</li>
            <li>• Ưu tiên đường bộ</li>
          </ul>
        </UiCard>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {["Đề thi mô phỏng", "Ôn tập 60 câu", "Thi thử tổng hợp"].map((title) => (
          <UiCard key={title} variant="panel" className="flex flex-col justify-between">
            <div>
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-drive-border-soft bg-drive-sidebar text-drive-action">
                ◆
              </div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-drive-muted">Luyện tập theo chuẩn Bộ GTVT</p>
            </div>
            <Link to="/exam" className="mt-4 text-sm font-medium text-drive-action hover:underline">
              {t("common.viewDetail")}
            </Link>
          </UiCard>
        ))}
      </div>
    </section>
  )
}
