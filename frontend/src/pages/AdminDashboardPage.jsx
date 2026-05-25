import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PageHeader } from "../components/PageHeader.jsx"
import { StatCard } from "../components/StatCard.jsx"
import { UiCard } from "../components/UiCard.jsx"
import { fetchAdminSummary } from "../lib/admin-api.js"
import { t } from "../lib/strings.js"

export function AdminDashboardPage() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAdminSummary()
      .then(setSummary)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu"))
  }, [])

  return (
    <section>
      <PageHeader title={t("pages.adminDashboard.title")} subtitle="Trung tâm Đào tạo · DriveGo" />

      {error ? (
        <UiCard variant="panel" className="mt-4">
          <p className="text-sm text-drive-danger">{error}</p>
        </UiCard>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Hồ sơ chờ duyệt"
          value={summary ? String(summary.submittedApplications) : "—"}
        />
        <StatCard
          label="Đăng ký ca chờ xác nhận"
          value={summary ? String(summary.pendingRegistrations) : "—"}
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <UiCard variant="panel">
          <h2 className="font-semibold text-white">Hồ sơ sát hạch</h2>
          <p className="mt-2 text-sm text-drive-muted">
            Xem, tải giấy tờ và duyệt hồ sơ học viên đã nộp.
          </p>
          <Link
            to="/admin/applications"
            className="mt-4 inline-block text-sm font-medium text-drive-action hover:underline"
          >
            Mở danh sách hồ sơ →
          </Link>
        </UiCard>
        <UiCard variant="panel">
          <h2 className="font-semibold text-white">Lịch thi & chạy thử</h2>
          <p className="mt-2 text-sm text-drive-muted">
            Xác nhận hoặc từ chối đăng ký ca thi lý thuyết và chạy thử.
          </p>
          <Link
            to="/admin/schedules"
            className="mt-4 inline-block text-sm font-medium text-drive-action hover:underline"
          >
            Mở hàng đợi lịch →
          </Link>
        </UiCard>
      </div>

      <UiCard variant="panel" className="mt-6">
        <p className="text-sm text-drive-muted">
          Đăng nhập demo: <strong className="text-white">center@drivego.demo</strong> hoặc{" "}
          <strong className="text-white">admin@drivego.demo</strong> · Mật khẩu: DriveGo123!
        </p>
      </UiCard>
    </section>
  )
}
