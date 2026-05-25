import { Link } from "react-router-dom"
import { EnrollCourseCta } from "./EnrollCourseCta.jsx"
import { PrimaryButton } from "./PrimaryButton.jsx"
import { UiCard } from "./UiCard.jsx"
import { useLicense } from "../context/LicenseContext.jsx"
import { t } from "../lib/strings.js"

/**
 * @param {{ feature: 'theory' | 'exam' }} props
 */
export function LicenseContentEmpty({ feature }) {
  const { activeClass, activeEntry, isEnrolled, catalog } = useLicense()
  const enrolled = isEnrolled(activeClass)

  if (!enrolled) {
    return <EnrollCourseCta licenseClass={activeClass} />
  }

  const anyReady = catalog.some((c) => c.contentReady)
  const title =
    feature === "exam" ? t("license.emptyExamTitle") : t("license.emptyTheoryTitle")
  const body = activeEntry?.contentReady
    ? t("license.emptyBody", { code: activeClass })
    : `Nội dung hạng ${activeClass} đang được cập nhật. Chạy import nội dung trên server hoặc chọn hạng khác.`

  return (
    <UiCard variant="panel" className="mx-auto max-w-lg text-center">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-3 text-sm text-drive-muted">{body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {anyReady ? (
          <Link to="/profile">
            <PrimaryButton variant="outline">{t("license.viewProfile")}</PrimaryButton>
          </Link>
        ) : (
          <Link to="/pricing">
            <PrimaryButton variant="action">Bảng giá</PrimaryButton>
          </Link>
        )}
      </div>
    </UiCard>
  )
}
