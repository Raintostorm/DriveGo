import { useAuth } from "../context/AuthContext.jsx"
import { UiCard } from "./UiCard.jsx"

export function AdminScopeBanner() {
  const { user } = useAuth()
  if (!user) return null

  const label =
    user.role === "system_admin"
      ? "Phạm vi: toàn hệ thống"
      : user.centerName
        ? `Đang quản lý: ${user.centerName}`
        : "Tài khoản chưa gắn trung tâm"

  return (
    <UiCard variant="panel" className="border-drive-accent/30 bg-drive-accent/5">
      <p className="text-sm text-drive-text">{label}</p>
    </UiCard>
  )
}
