// page-header · cabeçalho de página consistente · Eporifrutas Ops Hub
interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
      <div className="min-w-0">
        <h1 className="text-[22px] sm:text-[26px] font-bold text-[var(--ink)] tracking-[-0.01em] truncate">{title}</h1>
        {description && <p className="mt-1 text-[13px] text-[var(--sub)] max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
