import { PageHeader } from "../components/PageHeader.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

const notifications = [
  {
    title: "Thông báo lịch thi",
    desc: "Lịch thi sát hạch của bạn đã được xác nhận vào 25/10/2023 tại Trung tâm Sát hạch Củ Chi. Vui lòng có mặt lúc 07:30 sáng.",
    action: "Chi tiết",
  },
  {
    title: "Nhắc nhở bài học",
    desc: "Bạn quên hoàn thành bài tập Lý thuyết Chương 2.",
    action: "Học ngay",
  },
  {
    title: "Kết quả thi thử",
    desc: "Chúc mừng! Bạn đạt 35/35 điểm.",
    action: "Xem bảng điểm",
  },
]

export function NotificationsPage() {
  return (
    <section className="space-y-6">
      <PageHeader title={t("pages.notifications.title")} subtitle={t("pages.notifications.subtitle")} />

      <div className="flex flex-wrap gap-2">
        {[t("pages.notifications.all"), t("pages.notifications.unread"), t("pages.notifications.important")].map(
          (tab, i) => (
            <button
              key={tab}
              type="button"
              className={`rounded-drive-pill px-4 py-1.5 text-sm font-medium transition ${
                i === 0
                  ? "bg-drive-accent text-white"
                  : "border border-drive-border bg-drive-elevated text-drive-muted hover:text-white"
              }`}
            >
              {tab}
            </button>
          ),
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <UiCard key={n.title} variant="panel">
            <p className="font-semibold text-white">{n.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-drive-muted">{n.desc}</p>
            <PrimaryButton variant="action" className="mt-3 !py-1.5 !text-xs">
              {n.action}
            </PrimaryButton>
          </UiCard>
        ))}
      </div>
    </section>
  )
}
