import { useEffect, useState } from "react"
import { PageHeader } from "../components/PageHeader.jsx"
import { PrimaryButton } from "../components/PrimaryButton.jsx"
import { TextField } from "../components/TextField.jsx"
import { UiCard } from "../components/UiCard.jsx"
import {
  createAdminCenter,
  createCenterAdminUser,
  fetchAdminCenters,
} from "../lib/admin-api.js"

export function AdminCentersPage() {
  const [rows, setRows] = useState([])
  const [centerForm, setCenterForm] = useState({ name: "", city: "", address: "" })
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    centerId: "",
    fullName: "",
  })
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)

  function reload() {
    fetchAdminCenters().then(setRows).catch((e) => setError(e.message))
  }

  useEffect(() => {
    reload()
  }, [])

  async function addCenter(e) {
    e.preventDefault()
    try {
      await createAdminCenter(centerForm)
      setCenterForm({ name: "", city: "", address: "" })
      reload()
      setNotice("Đã tạo trung tâm")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi")
    }
  }

  async function addCenterAdmin(e) {
    e.preventDefault()
    try {
      await createCenterAdminUser(userForm)
      setNotice(`Đã tạo tài khoản ${userForm.email}`)
      setUserForm({ email: "", password: "", centerId: "", fullName: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi")
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Trung tâm đào tạo" subtitle="Chỉ system admin" />
      {error ? <p className="text-drive-danger">{error}</p> : null}
      {notice ? <p className="text-drive-success">{notice}</p> : null}

      <UiCard variant="panel">
        <h2 className="font-semibold text-white">Tạo trung tâm</h2>
        <form onSubmit={addCenter} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField
            label="Tên"
            value={centerForm.name}
            onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })}
            required
          />
          <TextField
            label="Thành phố"
            value={centerForm.city}
            onChange={(e) => setCenterForm({ ...centerForm, city: e.target.value })}
          />
          <TextField
            label="Địa chỉ"
            value={centerForm.address}
            onChange={(e) => setCenterForm({ ...centerForm, address: e.target.value })}
            className="sm:col-span-2"
          />
          <PrimaryButton type="submit">Tạo</PrimaryButton>
        </form>
      </UiCard>

      <UiCard variant="panel">
        <h2 className="font-semibold text-white">Tạo tài khoản center admin</h2>
        <form onSubmit={addCenterAdmin} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField
            label="Email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            required
          />
          <TextField
            label="Mật khẩu"
            type="password"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            required
          />
          <TextField
            label="Center ID (UUID)"
            value={userForm.centerId}
            onChange={(e) => setUserForm({ ...userForm, centerId: e.target.value })}
            required
            className="sm:col-span-2"
          />
          <PrimaryButton type="submit">Tạo center admin</PrimaryButton>
        </form>
      </UiCard>

      <UiCard variant="panel">
        <ul className="space-y-2 text-sm">
          {rows.map((c) => (
            <li key={c.id} className="text-white">
              <strong>{c.name}</strong>
              <span className="ml-2 text-drive-muted text-xs">{c.id}</span>
              {c.city ? <span className="block text-drive-muted">{c.city}</span> : null}
            </li>
          ))}
        </ul>
      </UiCard>
    </section>
  )
}
