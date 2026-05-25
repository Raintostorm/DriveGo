import { Link } from "react-router-dom"
import { PrimaryButton } from "./PrimaryButton.jsx"
import { UiCard } from "./UiCard.jsx"
import { useLicense } from "../context/LicenseContext.jsx"
import { DEFAULT_LICENSE_CLASS } from "../lib/license-classes.js"
import { t } from "../lib/strings.js"

/**
 * @param {{ feature: 'theory' | 'exam' }} props
 */
export function LicenseContentEmpty({ feature }) {
  const { activeClass, setActiveClass, catalog } = useLicense()
  const b2Ready = catalog.find((c) => c.code === DEFAULT_LICENSE_CLASS)?.contentReady

  const title =
    feature === "exam" ? t("license.emptyExamTitle") : t("license.emptyTheoryTitle")
  const body = t("license.emptyBody", { code: activeClass })

  return (
    <UiCard variant="panel" className="mx-auto max-w-lg text-center">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-3 text-sm text-drive-muted">{body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {b2Ready && activeClass !== DEFAULT_LICENSE_CLASS ? (
          <PrimaryButton variant="action" onClick={() => setActiveClass(DEFAULT_LICENSE_CLASS)}>
            {t("license.switchToB2")}
          </PrimaryButton>
        ) : null}
        <Link to="/profile">
          <PrimaryButton variant="outline">{t("license.viewProfile")}</PrimaryButton>
        </Link>
      </div>
    </UiCard>
  )
}
