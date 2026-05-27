import { Link } from "react-router-dom"
import { t } from "../lib/strings.js"

/**
 * @param {{ to?: string, size?: 'sm' | 'md' }} props
 */
export function BrandLogo({ to = "/", size = "md" }) {
  const iconSize = size === "sm" ? "size-8" : "size-8"
  const textSize = size === "sm" ? "text-lg" : "text-xl"

  const inner = (
    <>
      <img
        src="/images/login/logo.svg"
        alt=""
        className={`${iconSize} shrink-0`}
        width={32}
        height={32}
      />
      <span className={`font-bold text-white ${textSize}`}>{t("brand")}</span>
    </>
  )

  if (!to) {
    return <div className="flex items-center gap-3">{inner}</div>
  }

  return (
    <Link to={to} className="flex items-center gap-3">
      {inner}
    </Link>
  )
}
