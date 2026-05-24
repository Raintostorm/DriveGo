import { useState } from "react"
import { PrimaryButton } from "./PrimaryButton.jsx"
import { UiCard } from "./UiCard.jsx"

/**
 * @param {{
 *   storageKey: string,
 *   title: string,
 *   bullets: string[],
 *   confirmLabel: string,
 *   children: import('react').ReactNode,
 * }} props
 */
export function EnrollmentConsentCard({
  storageKey,
  title,
  bullets,
  confirmLabel,
  children,
}) {
  const [accepted, setAccepted] = useState(
    () => typeof localStorage !== "undefined" && localStorage.getItem(storageKey) === "1",
  )
  const [checked, setChecked] = useState(false)

  if (accepted) return children

  return (
    <UiCard variant="panel" className="border-drive-action/40">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-drive-muted">
        {bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-drive-text">
        <input
          type="checkbox"
          className="mt-1 accent-drive-action"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span>{confirmLabel}</span>
      </label>
      <PrimaryButton
        variant="action"
        className="mt-4"
        disabled={!checked}
        onClick={() => {
          localStorage.setItem(storageKey, "1")
          setAccepted(true)
        }}
      >
        Xác nhận và tiếp tục
      </PrimaryButton>
    </UiCard>
  )
}
