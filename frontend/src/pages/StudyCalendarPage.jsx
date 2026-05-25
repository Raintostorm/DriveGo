import { useEffect, useState } from "react"
import { PageHeader } from "../components/PageHeader.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { apiFetch } from "../lib/api.js"
import { t } from "../lib/strings.js"

export function StudyCalendarPage() {
  const [sessions, setSessions] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiFetch("/sessions/upcoming", { auth: true })
      .then((list) => {
        setSessions(list)
        setSelected(list[0] ?? null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setLoading(false))
  }, [])

  async function handleCheckIn() {
    if (!selected?.id) return
    setChecking(true)
    setMessage(null)
    try {
      await apiFetch(`/sessions/${selected.id}/check-in`, { method: "POST", auth: true, body: "{}" })
      setMessage("Điểm danh thành công!")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không điểm danh được")
    } finally {
      setChecking(false)
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader title={t("pages.studyCalendar.title")} subtitle="Buổi học tại trung tâm của bạn" />

      {loading ? <p className="text-drive-muted">{t("common.loading")}</p> : null}
      {error ? <p className="text-drive-danger">{error}</p> : null}
      {message ? <p className="text-drive-success">{message}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <UiCard variant="panel">
          <h3 className="text-xs font-bold uppercase text-drive-placeholder">
            {t("pages.studyCalendar.upcoming")}
          </h3>
          {sessions.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {sessions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(s)}
                    className={`w-full rounded-drive border px-3 py-2 text-left ${
                      selected?.id === s.id
                        ? "border-drive-action bg-drive-action/10"
                        : "border-drive-border-soft"
                    }`}
                  >
                    <p className="font-medium text-white">{s.title}</p>
                    <p className="text-xs text-drive-muted">
                      {s.sessionDate} · {s.startTime}–{s.endTime}
                      {s.venue ? ` · ${s.venue}` : ""}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-drive-muted">Chưa có buổi học sắp tới.</p>
          )}
        </UiCard>

        <UiCard variant="panel">
          {selected ? (
            <>
              <p className="text-xs text-drive-muted">{selected.sessionDate}</p>
              <h2 className="mt-2 font-semibold text-white">{selected.title}</h2>
              <p className="mt-2 text-sm text-drive-text">
                {selected.startTime}–{selected.endTime}
                {selected.sessionType ? ` · ${selected.sessionType}` : ""}
              </p>
              {selected.venue ? (
                <p className="text-xs text-drive-muted">{selected.venue}</p>
              ) : null}
              <PrimaryButton
                variant="action"
                className="mt-4"
                disabled={checking}
                onClick={handleCheckIn}
              >
                {checking ? t("common.loading") : t("pages.studyCalendar.checkIn")}
              </PrimaryButton>
            </>
          ) : (
            <p className="text-sm text-drive-muted">Chọn buổi học để điểm danh.</p>
          )}
        </UiCard>
      </div>
    </section>
  )
}
