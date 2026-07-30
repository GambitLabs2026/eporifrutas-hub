// section · bloco de conteúdo com cabeçalho (título, subtítulo, ação) · Eporifrutas Ops Hub
'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { T } from '@/lib/ui/theme'

interface SectionProps {
  title: string
  subtitle?: string
  icon?: React.ElementType
  action?: React.ReactNode
  href?: string
  hrefLabel?: string
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  flush?: boolean // sem padding no corpo (para tabelas full-bleed)
}

export function Section({ title, subtitle, icon: Icon, action, href, hrefLabel, children, className, bodyClassName, flush }: SectionProps) {
  return (
    <section className={`card overflow-hidden ${className ?? ''}`}>
      <header className="flex items-center justify-between gap-3 px-5 py-3.5 border-b" style={{ borderColor: T.line }}>
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: T.brandSoft }}>
              <Icon size={16} style={{ color: T.brandDark }} />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-[13.5px] font-bold text-[var(--ink)] leading-tight truncate">{title}</h3>
            {subtitle && <p className="text-[11.5px] text-[var(--muted)] truncate mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action ?? (href && (
          <Link href={href} className="text-[12px] font-semibold inline-flex items-center gap-1 shrink-0 hover:gap-1.5 transition-all" style={{ color: T.brand }}>
            {hrefLabel ?? 'Ver'} <ArrowRight size={13} />
          </Link>
        ))}
      </header>
      <div className={flush ? bodyClassName : `px-5 py-4 ${bodyClassName ?? ''}`}>{children}</div>
    </section>
  )
}
