// badge · etiqueta de estado premium (tons do tema) · Eporifrutas Ops Hub
import { TONE, type Tone } from '@/lib/ui/theme'

type LegacyVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

interface BadgeProps {
  children: React.ReactNode
  variant?: Tone | LegacyVariant
  className?: string
  dot?: boolean
}

// Compatibilidade com nomes antigos
const ALIAS: Record<LegacyVariant, Tone> = {
  default: 'neutral', success: 'success', warning: 'warning', danger: 'danger', info: 'info', purple: 'violet',
}

export function Badge({ children, variant = 'neutral', className, dot }: BadgeProps) {
  const tone = (ALIAS[variant as LegacyVariant] ?? variant) as Tone
  const t = TONE[tone]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-semibold whitespace-nowrap ${className ?? ''}`}
      style={{ backgroundColor: t.bg, color: t.fg, boxShadow: `inset 0 0 0 1px ${t.ring}` }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: t.dot }} />}
      {children}
    </span>
  )
}
