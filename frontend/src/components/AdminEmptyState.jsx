import { Link } from "react-router-dom"
import { UiCard } from "./UiCard.jsx"

/**
 * @param {{ title: string, description?: string, actionTo?: string, actionLabel?: string }} props
 */
export function AdminEmptyState({ title, description, actionTo, actionLabel }) {
  return (
    <UiCard variant="panel" className="text-center">
      <h3 className="font-semibold text-white">{title}</h3>
      {description ? <p className="mt-2 text-sm text-drive-muted">{description}</p> : null}
      {actionTo && actionLabel ? (
        <Link
          to={actionTo}
          className="mt-4 inline-block rounded-drive-pill border border-drive-border bg-drive-elevated px-6 py-3 text-sm font-bold text-white transition hover:bg-drive-panel"
        >
          {actionLabel}
        </Link>
      ) : null}
    </UiCard>
  )
}
