import { t } from "../lib/strings.js"

export function PageFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center rounded-drive border border-drive-border bg-drive-surface/80 px-6 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 text-drive-muted">
        <div className="size-8 animate-spin rounded-full border-2 border-drive-accent border-t-transparent" />
        <span className="text-sm">{t("common.loading")}</span>
      </div>
    </div>
  )
}
