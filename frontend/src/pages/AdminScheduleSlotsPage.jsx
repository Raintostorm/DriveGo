import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PageHeader } from "../components/PageHeader.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { TextField } from "../components/TextField.jsx"
import { UiCard } from "../components/UiCard.jsx"
import {
  createAdminSlot,
  deleteAdminSlot,
  fetchAdminSlots,
} from "../lib/admin-api.js"

const EMPTY = {
  slotDate: "",
  startTime: "08:00",
  endTime: "10:00",
  venue: "",
  licenseClass: "B2",
  slotType: "theory_exam",
  capacity: 30,
}

export function AdminScheduleSlotsPage() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState(null)

  function reload() {
    fetchAdminSlots().then(setRows).catch((e) => setError(e.message))
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    try {
      await createAdminSlot(form)
      setForm(EMPTY)
      reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi")
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Quản lý ca thi"
        subtitle="Tạo ca lý thuyết / chạy thử"
        actions={
          <Link to="/admin/schedules" className="text-sm text-drive-action">
            Đăng ký chờ duyệt →
          </Link>
        }
      />
      {error ? <p className="text-drive-danger">{error}</p> : null}

      <UiCard variant="panel">
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Ngày"
            type="date"
            value={form.slotDate}
            onChange={(e) => setForm({ ...form, slotDate: e.target.value })}
            required
          />
          <TextField
            label="Hạng"
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
          <TextField
            label="Địa điểm"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="sm:col-span-2"
          />
          <select
            className="rounded-drive border border-drive-border bg-drive-elevated px-3 py-2 text-white"
            value={form.slotType}
            onChange={(e) => setForm({ ...form, slotType: e.target.value })}
          >
            <option value="theory_exam">Thi lý thuyết</option>
            <option value="practice_exam">Chạy thử</option>
          </select>
          <TextField
            label="Sức chứa"
            type="number"
            value={String(form.capacity)}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
          />
          <PrimaryButton type="submit" className="sm:col-span-2">
            Tạo ca
          </PrimaryButton>
        </form>
      </UiCard>

      <UiCard variant="panel" className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-drive-muted">
              <th className="py-2 text-left">Ngày</th>
              <th className="py-2 text-left">Giờ</th>
              <th className="py-2 text-left">Hạng</th>
              <th className="py-2 text-left">Loại</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-t border-drive-border-soft">
                <td className="py-2 text-white">{s.slotDate}</td>
                <td className="py-2 text-white">
                  {s.startTime}–{s.endTime}
                </td>
                <td className="py-2">{s.licenseClass}</td>
                <td className="py-2">{s.slotType}</td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    className="text-drive-danger text-xs"
                    onClick={() => deleteAdminSlot(s.id).then(reload)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </UiCard>
    </section>
  )
}
