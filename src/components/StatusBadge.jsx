const toneClass = {
  success: "bg-drive-success/10 text-drive-success",
  warning: "bg-amber-500/20 text-amber-300",
  danger: "bg-drive-danger/10 text-drive-danger",
  info: "bg-drive-action/10 text-drive-action",
  neutral: "bg-drive-elevated text-drive-muted",
}

/**
 * @param {{ children: import('react').ReactNode, tone?: keyof typeof toneClass }} props
 */
export function StatusBadge({ children, tone = "neutral" }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClass[tone]}`}>
      {children}
    </span>
  )
}
