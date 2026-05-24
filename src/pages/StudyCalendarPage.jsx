import { PageHeader } from "../components/PageHeader.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

const tasks = [
  { title: "Hệ thống biển báo GT", date: "16/10/2023 — 08:00", type: "Lý thuyết" },
  { title: "Thi thử mô phỏng", date: "20/10/2023 — 09:00", type: "Lịch thi" },
]

export function StudyCalendarPage() {
  return (
    <section className="space-y-6">
      <PageHeader title={`${t("pages.studyCalendar.title")} — Tháng 10, 2023`} />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <UiCard variant="panel">
          <div className="mb-4 flex flex-wrap gap-4 text-xs">
            <span className="text-drive-accent">● Lý thuyết</span>
            <span className="text-drive-success">● Thực hành</span>
            <span className="text-drive-danger">● Lịch thi</span>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {Array.from({ length: 35 }, (_, i) => i + 1).map((d) => (
              <div
                key={d}
                className={`rounded-lg py-2 ${
                  d === 16 || d === 20
                    ? "bg-drive-action font-semibold text-white"
                    : "bg-drive-elevated text-drive-muted"
                } ${d > 31 ? "opacity-0" : ""}`}
              >
                {d <= 31 ? d : ""}
              </div>
            ))}
          </div>
        </UiCard>

        <div className="space-y-4">
          <UiCard variant="panel">
            <p className="text-xs text-drive-muted">Hôm nay, 10 Tháng 10 2023</p>
            <h2 className="mt-2 font-semibold text-white">{t("pages.studyCalendar.eventDetail")}</h2>
            <p className="mt-2 text-sm text-drive-text">Hệ thống biển báo GT · 14:30–16:30</p>
            <p className="text-xs text-drive-muted">Phòng 402, Tòa A — DriveGo</p>
            <PrimaryButton variant="action" className="mt-4">
              {t("pages.studyCalendar.checkIn")}
            </PrimaryButton>
          </UiCard>
          <UiCard variant="panel">
            <h3 className="text-xs font-bold uppercase text-drive-placeholder">
              {t("pages.studyCalendar.upcoming")}
            </h3>
            <ul className="mt-3 space-y-3 text-sm">
              {tasks.map((task) => (
                <li key={task.title} className="border-b border-drive-border-soft pb-2 last:border-0">
                  <p className="font-medium text-white">{task.title}</p>
                  <p className="text-xs text-drive-muted">
                    {task.date} · {task.type}
                  </p>
                </li>
              ))}
            </ul>
          </UiCard>
        </div>
      </div>
    </section>
  )
}
