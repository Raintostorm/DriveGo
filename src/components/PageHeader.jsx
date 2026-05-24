/**
 * @param {{ title: string, subtitle?: string, actions?: import('react').ReactNode }} props
 */
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle ? <p className="mt-1 text-base text-drive-muted">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-4">{actions}</div> : null}
    </div>
  )
}
