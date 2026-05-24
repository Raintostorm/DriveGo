const paddingClassByKey = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-8 sm:p-10",
}

export function UiCard({
  children,
  className = "",
  as: Component = "div",
  padding = "md",
  variant = "surface",
}) {
  const paddingClass = paddingClassByKey[padding] ?? paddingClassByKey.md
  const variantClass =
    variant === "panel"
      ? "border-drive-border-soft bg-drive-panel"
      : "border-drive-border bg-drive-surface backdrop-blur-sm"

  return (
    <Component
      className={`rounded-drive border shadow-drive-card ${variantClass} ${paddingClass} ${className}`.trim()}
    >
      {children}
    </Component>
  )
}
