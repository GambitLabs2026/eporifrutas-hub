'use client'
// analise · Módulo 4 — Análise de Tendências: a nossa leitura das vendas, comparável com o PHC (demo)
// Gráficos em CSS/SVG puro (sem bibliotecas): barras 12 meses (€/Kg), donut por categoria, canais e top artigos.

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, Euro, Weight, CalendarRange, PieChart,
  BarChart3, Store, Package, Sparkles,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { StatCard, StatGrid } from '@/components/ui/stat'
import { Section } from '@/components/ui/section'
import { T, eur0, num, kg, pct, type Tone } from '@/lib/ui/theme'
import {
  VENDAS_MENSAIS, VENDAS_POR_CATEGORIA, VENDAS_POR_CANAL, TOP_ARTIGOS, INSIGHTS,
} from '@/lib/mock'

const POS = '#1B7A43'
const BAR_SOFT = '#D2E7D8'

export default function AnalisePage() {
  const [metrica, setMetrica] = useState<'valor' | 'kg'>('valor')

  const ultimo = VENDAS_MENSAIS[VENDAS_MENSAIS.length - 1]
  const penultimo = VENDAS_MENSAIS[VENDAS_MENSAIS.length - 2]
  const crescimentoValor = ((ultimo.valor - penultimo.valor) / penultimo.valor) * 100
  const crescimentoKg = ((ultimo.kg - penultimo.kg) / penultimo.kg) * 100

  const totalAno = VENDAS_MENSAIS.reduce((s, v) => s + v.valor, 0)
  const totalCategoria = VENDAS_POR_CATEGORIA.reduce((s, c) => s + c.valor, 0)
  const max = Math.max(...VENDAS_MENSAIS.map(v => (metrica === 'valor' ? v.valor : v.kg)))

  const toggle = (
    <div className="flex rounded-lg p-0.5 text-[12px] font-semibold" style={{ backgroundColor: T.surfaceAlt, border: `1px solid ${T.line}` }}>
      {(['valor', 'kg'] as const).map(m => (
        <button key={m} onClick={() => setMetrica(m)} className="px-3 py-1 rounded-md transition-colors"
          style={metrica === m ? { backgroundColor: '#fff', color: T.ink, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' } : { color: T.muted }}>
          {m === 'valor' ? '€' : 'Kg'}
        </button>
      ))}
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Análise de Tendências"
        description="A nossa leitura das vendas — pronta a cruzar com o PHC. Séries de 12 meses, mix por categoria, canais e artigos."
      />

      <StatGrid cols={4}>
        <StatCard icon={Euro} tone="brand" value={eur0(ultimo.valor)} label={`Faturação (${ultimo.mes})`} delta={crescimentoValor} />
        <StatCard icon={Weight} tone="info" value={kg(ultimo.kg)} label={`Volume (${ultimo.mes})`} delta={crescimentoKg} />
        <StatCard icon={CalendarRange} tone="citrus" value={eur0(totalAno)} label="Faturação 12 meses" hint={`média ${eur0(totalAno / 12)}/mês`} />
        <StatCard icon={PieChart} tone="violet" value={`${VENDAS_POR_CATEGORIA.length} gamas`} label="Mix de categorias" hint={`${eur0(totalCategoria)} no trimestre`} />
      </StatGrid>

      {/* Barras 12 meses */}
      <Section className="mt-4" title="Faturação — últimos 12 meses" subtitle={`A nossa análise · comparável com o PHC · ${ultimo.mes} destacado`} icon={BarChart3} action={toggle}>
        <div className="pt-6">
          <div className="flex items-end gap-2.5" style={{ height: 180 }}>
            {VENDAS_MENSAIS.map((v, i) => {
              const val = metrica === 'valor' ? v.valor : v.kg
              const ult = i === VENDAS_MENSAIS.length - 1
              return (
                <div key={v.mes} className="flex-1 rounded-t-md relative transition-all group" style={{ height: `${Math.max((val / max) * 100, 2)}%`, backgroundColor: ult ? T.brand : BAR_SOFT }}
                  title={metrica === 'valor' ? eur0(val) : kg(val)}>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity tnum" style={{ color: T.ink }}>
                    {metrica === 'valor' ? eur0(val) : kg(val)}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-2.5 mt-2">
            {VENDAS_MENSAIS.map((v, i) => (
              <span key={v.mes} className={`flex-1 text-center text-[10px] ${i === VENDAS_MENSAIS.length - 1 ? 'font-bold text-[var(--sub)]' : 'text-[var(--muted)]'}`}>{v.mes}</span>
            ))}
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Por categoria — donut */}
        <Section title="Vendas por categoria" subtitle="Mix de gamas · peso no total faturado" icon={PieChart}>
          <div className="flex items-center gap-5">
            <Donut fatias={VENDAS_POR_CATEGORIA} total={totalCategoria} />
            <div className="flex-1 space-y-3">
              {VENDAS_POR_CATEGORIA.map(c => {
                const p = (c.valor / totalCategoria) * 100
                return (
                  <div key={c.categoria}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--ink)]">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.cor }} />
                        {c.categoria}
                      </span>
                      <span className="text-[12px] font-semibold text-[var(--sub)] tnum">{num(p)}%</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: T.surfaceAlt }}>
                        <div className="h-full rounded-full" style={{ width: `${p}%`, backgroundColor: c.cor }} />
                      </div>
                      <span className="text-[11px] text-[var(--muted)] tnum w-16 text-right">{eur0(c.valor)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Section>

        {/* Por canal */}
        <Section title="Vendas por canal" subtitle="Faturação, volume e variação homóloga" icon={Store}>
          <div className="space-y-2">
            {VENDAS_POR_CANAL.map(c => (
              <div key={c.canal} className="flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5" style={{ borderColor: T.line }}>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{c.canal}</p>
                  <p className="text-[11px] text-[var(--muted)]">{kg(c.kg)}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[13px] font-bold tnum" style={{ color: T.forest }}>{eur0(c.valor)}</span>
                  <Variacao v={c.variacao} className="w-16 justify-end" />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Top artigos */}
      <Section className="mt-4" title="Top artigos" subtitle="Os que mais pesam na faturação · variação vs. mês anterior" icon={Package} flush>
        <div className="overflow-x-auto">
          <table className="dtable">
            <thead>
              <tr>
                <th>Artigo</th><th>Categoria</th>
                <th style={{ textAlign: 'right' }}>Volume</th>
                <th style={{ textAlign: 'right' }}>Faturação</th>
                <th style={{ textAlign: 'right' }}>Variação</th>
              </tr>
            </thead>
            <tbody>
              {TOP_ARTIGOS.map(a => (
                <tr key={a.nome}>
                  <td className="font-semibold text-[var(--ink)]">{a.nome}</td>
                  <td><Badge variant={CATEGORIA_TONE[a.categoria] ?? 'neutral'}>{a.categoria}</Badge></td>
                  <td className="tnum text-[var(--sub)]" style={{ textAlign: 'right' }}>{kg(a.kg)}</td>
                  <td className="tnum font-bold" style={{ textAlign: 'right', color: T.forest }}>{eur0(a.valor)}</td>
                  <td style={{ textAlign: 'right' }}><Variacao v={a.variacao} className="justify-end" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Insights */}
      <div className="mt-4">
        <h3 className="text-[13.5px] font-bold text-[var(--ink)]">A nossa leitura</h3>
        <p className="text-[11.5px] text-[var(--muted)] mb-3">Insights que o PHC não dá de forma imediata</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {INSIGHTS.map((ins, i) => {
            const s = INSIGHT_STYLE[ins.tipo]
            const Icon = s.icon
            return (
              <div key={i} className="card p-4" style={{ borderLeft: `3px solid ${s.cor}` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
                    <Icon size={15} style={{ color: s.cor }} />
                  </span>
                  <h4 className="text-[13px] font-bold text-[var(--ink)] leading-tight">{ins.titulo}</h4>
                </div>
                <p className="text-[12px] text-[var(--sub)] leading-relaxed">{ins.texto}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Variação (seta + %) ─────────────────────────────────────────────────────
function Variacao({ v, className }: { v: number; className?: string }) {
  const positivo = v >= 0
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-semibold tnum ${className ?? ''}`} style={{ color: positivo ? POS : T.tomato }}>
      {positivo ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {pct(v)}
    </span>
  )
}

// ─── Donut SVG puro ──────────────────────────────────────────────────────────
function Donut({ fatias, total }: { fatias: typeof VENDAS_POR_CATEGORIA; total: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  let acumulado = 0
  return (
    <div className="relative shrink-0" style={{ width: 128, height: 128 }}>
      <svg viewBox="0 0 128 128" className="w-32 h-32 -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke={T.surfaceAlt} strokeWidth="16" />
        {fatias.map(f => {
          const frac = f.valor / total
          const dash = frac * circ
          const offset = -acumulado * circ
          acumulado += frac
          return (
            <circle key={f.categoria} cx="64" cy="64" r={r} fill="none" stroke={f.cor} strokeWidth="16"
              strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={offset} />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] text-[var(--muted)] leading-none">Total</span>
        <span className="text-[13px] font-bold text-[var(--ink)] leading-tight mt-0.5 tnum">{eur0(total)}</span>
      </div>
    </div>
  )
}

const CATEGORIA_TONE: Record<string, Tone> = {
  'Frutamania': 'success',
  'Da Horta': 'warning',
  'Shake it up': 'info',
}

const INSIGHT_STYLE: Record<'alta' | 'baixa' | 'info', { cor: string; bg: string; icon: React.ElementType }> = {
  alta: { cor: T.brand, bg: T.brandSoft, icon: TrendingUp },
  baixa: { cor: T.tomato, bg: T.tomatoSoft, icon: TrendingDown },
  info: { cor: T.sky, bg: T.skySoft, icon: Sparkles },
}
