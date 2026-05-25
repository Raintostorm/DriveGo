import { useEffect, useState } from "react"
import { PageHeader } from "../components/PageHeader.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { TextField } from "../components/TextField.jsx"
import { UiCard } from "../components/UiCard.jsx"
import {
  adminSessionCheckIn,
  createAdminClassSession,
  fetchAdminClassSessions,
  fetchAdminSessionAttendance,
} from "../lib/admin-api.js"

const EMPTY = {
  title: "",
  sessionDate: "",
  startTime: "08:00",
  endTime: "10:00",
  venue: "",
  sessionType: "theory",
  licenseClass: "B2",
  maxCapacity: 30,
}

export function AdminClassSessionsPage() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [selectedId, setSelectedId] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [checkInUserId, setCheckInUserId] = useState("")
  const [error, setError] = useState(null)

  function reload() {
    fetchAdminClassSessions().then(setRows).catch((e) => setError(e.message))
  }

  useEffect(() => {
    reload()
  }, [])

  useEffect(() => {
    if (!selectedId) return
    fetchAdminSessionAttendance(selectedId).then(setAttendance)
  }, [selectedId])

  async function handleCreate(e) {
    e.preventDefault()
    try {
      await createAdminClassSession(form)
      setForm(EMPTY)
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi")
    }
  }

  async function handleCheckIn() {
    if (!selectedId || !checkInUserId.trim()) return
    await adminSessionCheckIn(selectedId, checkInUserId.trim())
    setCheckInUserId("")
    const list = await fetchAdminSessionAttendance(selectedId)
    setAttendance(list)
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Buổi học & điểm danh" subtitle="Lịch lớp tại trung tâm" />
      {error ? <p className="text-drive-danger">{error}</p> : null}

      <UiCard variant="panel">
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="sm:col-span-2"
          />
          <TextField
            label="Ngày"
            type="date"
            value={form.sessionDate}
            onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
            required
          />
          <TextField
            label="Hạng (tùy chọn)"
            value={form.licenseClass}
            onChange={(e) => setForm({ ...form, licenseClass: e.target.value })}
          />
          <TextField
            label="Bắt đầu"
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />
          <TextField
            label="Kết thúc"
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />
          <PrimaryButton type="submit" className="sm:col-span-2">
            Tạo buổi học
          </PrimaryButton>
        </form>
      </UiCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <UiCard variant="panel">
          <h3 className="font-semibold text-white">Danh sách buổi</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {rows.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`w-full rounded-drive border px-3 py-2 text-left ${
                    selectedId === s.id
                      ? "border-drive-action bg-drive-action/10"
                      : "border-drive-border"
                  }`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <span className="font-medium text-white">{s.title}</span>
                  <span className="block text-drive-muted">
                    {s.sessionDate} · {s.startTime}–{s.endTime}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </UiCard>

        <UiCard variant="panel">
          <h3 className="font-semibold text-white">Điểm danh</h3>
          {selectedId ? (
            <>
              <div className="mt-3 flex gap-2">
                <TextField
                  label="User ID học viên"
                  value={checkInUserId}
                  onChange={(e) => setCheckInUserId(e.target.value)}
                  className="flex-1"
                />
                <PrimaryButton type="button" className="self-end" onClick={handleCheckIn}>
                  Check-in
                </PrimaryButton>
              </div>
              <ul className="mt-4 space-y-1 text-sm text-drive-muted">
                {attendance.map((a) => (
                  <li key={a.id}>
                    {a.userId} · {new Date(a.checkedInAt).toLocaleString("vi-VN")} ({a.method})
                  </li>
                ))}
                {!attendance.length ? <li>Chưa có điểm danh.</li> : null}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-sm text-drive-muted">Chọn một buổi học.</p>
          )}
        </UiCard>
      </div>
    </section>
  )
}
