import { t } from "../lib/strings.js"

export function SocialAuthButtons() {
  return (
    <>
      <div className="flex items-center gap-4 py-4">
        <div className="h-px flex-1 bg-drive-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-drive-muted">
          {t("pages.login.orContinue")}
        </span>
        <div className="h-px flex-1 bg-drive-border" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-drive-border bg-drive-elevated text-sm font-medium text-white transition hover:bg-drive-panel"
        >
          <img src="/images/login/google.svg" alt="" className="size-5" width={20} height={20} />
          Google
        </button>
        <button
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-drive-border bg-drive-elevated text-sm font-medium text-white transition hover:bg-drive-panel"
        >
          <img src="/images/login/facebook.svg" alt="" className="size-5" width={20} height={20} />
          Facebook
        </button>
      </div>
    </>
  )
}
