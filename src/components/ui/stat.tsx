// stat · KPI card premium + grelha · Eporifrutas Ops Hub
'use client'

import Link from 'next/link'
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react'
import { TONE, type Tone } from '@/lib/ui/theme'

export function StatGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: 3 | 4 | 5 }) {
  const map = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }
  return <div className={`grid grid-cols-2 ${map[cols]} gap-3`}>{children}</div>
}

interface StatCardProps {
  icon?: React.ElementType
  label: string
  value: string
  hint?: string
  delta?: number // variação % (opcional)
  tone?: Tone
  href?: string
}

export function StatCard({ icon: Icon, label, value, hint, delta, tone = 'neutral', href }: StatCardProps) {
  const t = TONE[tone]
  const inner = (
    <>
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: t.bg }}>
            <Icon size={17} style={{ color: t.fg }} />
          </span>
        )}
        {delta !== undefined ? (
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold tnum"
            style={{ color: delta >= 0 ? '#1B7A43' : '#B23A20' }}>
            {delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(delta).toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
          </span>
        ) : href ? (
          <ArrowRight size={15} className="text-[var(--muted)] opacity-50 group-hover:opacity-100 transition-opacity" />
        ) : null}
      </div>
      <p className="text-[22px] leading-none font-bold text-[var(--ink)] tnum">{value}</p>
      <p className="text-[12.5px] font-medium text-[var(--sub)] mt-2">{label}</p>
      {hint && <p className="text-[11px] text-[var(--muted)] mt-0.5">{hint}</p>}
    </>
  )
  const cls = 'card p-4 block'
  return href
    ? <Link href={href} className={`${cls} card-hover group`}>{inner}</Link>
    : <div className={cls}>{inner}</div>
}
