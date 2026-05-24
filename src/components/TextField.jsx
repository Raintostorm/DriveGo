/**
 * @param {{ id: string, label: string, type?: string, placeholder?: string, className?: string, icon?: string }} props
 */
export function TextField({ id, label, type = "text", placeholder, className = "", icon }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-drive-text">
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-drive-muted"
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-drive-pill border border-drive-border bg-drive-elevated py-4 text-sm text-drive-text outline-none transition placeholder:text-drive-placeholder focus:ring-2 focus:ring-drive-accent ${icon ? "pl-11 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  )
}
