'use client'
// pipeline-ia · mostra as várias IAs que processam a encomenda até à linguagem do PHC · Eporifrutas Ops Hub

import { ScanLine, Brain, Sparkles, Scale, ShieldCheck, Check, AlertTriangle, X, Clock, ChevronRight } from 'lucide-react'
import { T } from '@/lib/ui/theme'
import { PIPELINE_IA, type EstadoEtapa } from '@/lib/ia/pipeline'

const ICON: Record<string, React.ElementType> = {
  leitura: ScanLine, interpretacao: Brain, correspondencia: Sparkles, normalizacao: Scale, validacao: ShieldCheck,
}
const STATUS = {
  ok: { cor: T.brand, bg: T.brandSoft, Icon: Check },
  aviso: { cor: '#9A6206', bg: '#FDF3E0', Icon: AlertTriangle },
  erro: { cor: T.tomato, bg: T.tomatoSoft, Icon: X },
  pendente: { cor: T.muted, bg: T.surfaceAlt, Icon: Clock },
} as const

export function PipelineIA({ estados }: { estados: Record<string, EstadoEtapa> }) {
  return (
    <div className="px-5 py-3.5 border-b" style={{ borderColor: T.line, backgroundColor: T.surfaceAlt }}>
      <div className="flex items-center gap-1.5 mb-2.5">
        <Sparkles size={13} style={{ color: T.brandDark }} />
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">Pipeline de IA · extração → linguagem PHC</p>
      </div>
      <div className="flex items-stretch gap-1 overflow-x-auto scrollbar-hide">
        {PIPELINE_IA.map((etapa, i) => {
          const st = STATUS[estados[etapa.chave] ?? 'pendente']
          const Icon = ICON[etapa.chave] ?? Sparkles
          return (
            <div key={etapa.chave} className="flex items-center gap-1 shrink-0">
              <div className="rounded-lg px-2.5 py-2 min-w-[126px]" style={{ backgroundColor: '#fff', border: `1px solid ${T.line}` }} title={etapa.descricao}>
                <div className="flex items-center justify-between gap-1.5">
                  <Icon size={14} style={{ color: T.sub }} />
                  <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: st.bg }}>
                    <st.Icon size={10} style={{ color: st.cor }} />
                  </span>
                </div>
                <p className="text-[11.5px] font-semibold text-[var(--ink)] mt-1.5 leading-tight">{etapa.nome}</p>
                <p className="text-[9.5px] font-mono mt-0.5 truncate" style={{ color: T.brandDark }}>{etapa.motor}</p>
              </div>
              {i < PIPELINE_IA.length - 1 && <ChevronRight size={13} className="shrink-0" style={{ color: T.lineStrong }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
