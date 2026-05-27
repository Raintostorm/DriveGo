import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PageHeader } from "../components/PageHeader.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { fetchAdminLicenseClasses } from "../lib/admin-api.js"

export function AdminCoursesPage() {
  const { user } = useAuth()
  const readOnly = user?.role === "center_admin"
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAdminLicenseClasses()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
  }, [])

  return (
    <section className="space-y-6">
      <PageHeader
        title="Khóa học theo hạng"
        subtitle={readOnly ? "Chế độ xem — chỉnh sửa do quản trị hệ thống" : "Chỉnh học phí và chương học"}
      />
      {error ? <p className="text-drive-danger">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((lc) => (
          <UiCard key={lc.code} variant="panel">
            <h2 className="text-lg font-semibold text-white">Hạng {lc.code}</h2>
            <p className="mt-1 text-sm text-drive-muted">{lc.description ?? ""}</p>
            <p className="mt-2 text-sm text-white">
              Học phí: {Number(lc.enrollmentFee ?? lc.price ?? 0).toLocaleString("vi-VN")}đ
            </p>
            <Link
              to={`/admin/courses/${lc.code}/chapters`}
              className="mt-4 inline-block text-sm text-drive-action hover:underline"
            >
              {readOnly ? "Xem chương →" : "Sửa chương →"}
            </Link>
          </UiCard>
        ))}
      </div>
    </section>
  )
}
