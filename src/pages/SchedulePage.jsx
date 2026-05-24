import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { StatusBadge } from "../components/StatusBadge.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { t } from "../lib/strings.js"

const slots = [
  { time: "08:00 - 11:30", label: "Ca sáng — Sân Ngọc Hà", seats: "12/40", tone: "success" },
  { time: "13:30 - 17:00", label: "Ca chiều — Sân Ngọc Hà", seats: "05/40", tone: "warning" },
  { time: "18:00 - 20:00", label: "Ca tối — Sân Ngọc Hà", seats: t("pages.schedule.full"), tone: "danger" },
]

export function SchedulePage() {
  return (
    <section className="space-y-6">
      <UiCard padding="lg" variant="panel">
        <p className="text-sm font-medium text-drive-action">{t("brandHub")}</p>
        <h1 className="mt-2 text-4xl font-bold text-white">
          {t("pages.schedule.title")}{" "}
          <span className="text-drive-action">{t("pages.schedule.titleHighlight")}</span>
        </h1>
        <p className="mt-2 max-w-3xl text-drive-muted">{t("pages.schedule.subtitle")}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {["B2", "Hà Nội", "Tháng 10"].map((v) => (
            <select
              key={v}
              className="rounded-drive border border-drive-border bg-drive-elevated px-3 py-2 text-sm text-drive-text"
              defaultValue={v}
            >
              <option>{v}</option>
            </select>
          ))}
          <PrimaryButton variant="action">{t("common.search")}</PrimaryButton>
        </div>
      </UiCard>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <UiCard variant="panel">
          <h2 className="font-semibold text-white">Lịch thi Tháng 10, 2023</h2>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs sm:text-sm">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                type="button"
                className={`rounded-lg py-2 transition ${
                  day === 4
                    ? "bg-drive-action font-semibold text-white"
                    : "bg-drive-elevated text-drive-muted hover:text-white"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </UiCard>

        <UiCard variant="panel">
          <h2 className="font-semibold text-white">{t("pages.schedule.slotsTitle")} 04/10</h2>
          <div className="mt-4 space-y-3">
            {slots.map((slot) => (
              <div
                key={slot.time}
                className="rounded-drive border border-drive-border-soft bg-drive-sidebar p-3"
              >
                <p className="font-medium text-white">{slot.time}</p>
                <p className="text-xs text-drive-muted">{slot.label}</p>
                <div className="mt-2 flex items-center justify-between">
                  <StatusBadge tone={slot.tone}>{slot.seats}</StatusBadge>
                  {slot.tone !== "danger" ? (
                    <PrimaryButton variant="action" className="!py-1.5 !text-xs">
                      {t("common.registerNow")}
                    </PrimaryButton>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </UiCard>
      </div>
    </section>
  )
}
