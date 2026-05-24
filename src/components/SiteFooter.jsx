import { Link } from "react-router-dom"
import { BrandLogo } from "./BrandLogo.jsx"
import { t } from "../lib/strings.js"

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-drive-border-soft pt-12 pb-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo to={null} />
          <p className="mt-3 text-sm leading-relaxed text-drive-muted">{t("footer.tagline")}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-drive-text">{t("footer.platform")}</p>
          <ul className="mt-3 space-y-2 text-sm text-drive-muted">
            <li>
              <Link to="/pricing" className="hover:text-white">
                Khóa học B1/B2
              </Link>
            </li>
            <li>
              <Link to="/exam" className="hover:text-white">
                Thi thử online
              </Link>
            </li>
            <li>
              <Link to="/docs" className="hover:text-white">
                Mẹo học 600 câu
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-drive-text">{t("footer.support")}</p>
          <ul className="mt-3 space-y-2 text-sm text-drive-muted">
            <li>Trung tâm trợ giúp</li>
            <li>{t("footer.privacy")}</li>
            <li>{t("footer.terms")}</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-drive-text">{t("footer.contact")}</p>
          <ul className="mt-3 space-y-2 text-sm text-drive-muted">
            <li>Quận 1, TP. Hồ Chí Minh</li>
            <li>support@drivego.vn</li>
            <li>1900 6789</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-drive-border-soft pt-6 text-xs text-drive-placeholder">
        <p>{t("footer.copyright")}</p>
        <p>Tiếng Việt | English</p>
      </div>
    </footer>
  )
}
