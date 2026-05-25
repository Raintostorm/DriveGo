import { Link } from "react-router-dom"
import { PrimaryButton } from "./PrimaryButton.jsx"
import { UiCard } from "./UiCard.jsx"

/**
 * @param {{ licenseClass: string }} props
 */
export function EnrollCourseCta({ licenseClass }) {
  return (
    <UiCard variant="panel" className="mx-auto max-w-lg text-center">
      <h1 className="text-xl font-bold text-white">Đăng ký khóa học hạng {licenseClass}</h1>
      <p className="mt-3 text-sm text-drive-muted">
        Bạn cần thanh toán phí đăng ký khóa (thử nghiệm ~5.000đ qua SePay) để học lý thuyết và làm
        bài thi thử. Premium là tùy chọn, không bắt buộc.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to={`/enroll?class=${encodeURIComponent(licenseClass)}`}>
          <PrimaryButton variant="action">Đăng ký & thanh toán</PrimaryButton>
        </Link>
        <Link to="/pricing">
          <PrimaryButton variant="outline">Xem bảng giá</PrimaryButton>
        </Link>
      </div>
    </UiCard>
  )
}
