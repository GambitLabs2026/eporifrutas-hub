'use client'
// conferencia · Módulo 2 — Receção vs. Faturação: pesagem em Kg vs. faturado do fornecedor → creditação · Eporifrutas Hub
// Master-detail: lista de conferências + detalhe linha-a-linha com diferenças de Kg, impacto € e pedido de creditação.

import { useMemo, useState } from 'react'
import {
  ClipboardCheck, AlertTriangle, HandCoins, CheckCircle2, PackageCheck,
  ArrowDownRight, ArrowUpRight, Send,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard, StatGrid } from '@/components/ui/stat'
import { T, eur, kg, type Tone } from '@/lib/ui/theme'
import {
  CONFERENCIAS, kpisConferencias, ESTADO_CONFERENCIA_LABEL,
  type Conferencia, type ConferenciaLinha, type EstadoConferencia,
} from '@/lib/mock'

const fmtData = (iso: string) =>
  new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

const ESTADO_TONE: Record<EstadoConferencia, Tone> = {
  conforme: 'success', 'com-discrepancia': 'warning', 'creditacao-pedida': 'info', resolvida: 'neutral',
}
const LINHA_TONE: Record<ConferenciaLinha['estado'], Tone> = {
  conforme: 'success', falha: 'danger', excesso: 'warning',
}
const LINHA_LABEL: Record<ConferenciaLinha['estado'], string> = {
  conforme: 'Conforme', falha: 'Falta', excesso: 'Excesso',
}

export default function ConferenciaPage() {
  const [conferencias, setConferencias] = useState<Conferencia[]>(() => JSON.parse(JSON.stringify(CONFERENCIAS)))
  const [selId, setSelId] = useState<string>(CONFERENCIAS[0].id)

  const sel = conferencias.find(c => c.id === selId) ?? conferencias[0]
  const kpis = useMemo(() => kpisConferencias(), [])

  const pedirCreditacao = () =>
    setConferencias(prev => prev.map(c => c.id !== sel.id ? c : { ...c, estado: 'creditacao-pedida' }))

  return (
    <div>
      <PageHeader
        title="Receção vs. Faturação"
        description="Pesamos toda a mercadoria em Kg à entrada e comparamos com o que o fornecedor faturou — detetando falhas de entrega e preparando pedidos de creditação automáticos."
      />

      <StatGrid cols={4}>
        <StatCard icon={ClipboardCheck} tone="brand" value={String(kpis.total)} label="Conferências" hint="rececionadas hoje" />
        <StatCard icon={AlertTriangle} tone="warning" value={String(kpis.comDiscrepancia)} label="Com discrepância" hint="falhas detetadas" />
        <StatCard icon={Send} tone="success" value={String(kpis.creditacaoPedida)} label="Creditação pedida" hint="a aguardar fornecedor" />
        <StatCard icon={HandCoins} tone="citrus" value={eur(kpis.valorACreditar)} label="A creditar a fornecedores" hint="impacto financeiro" />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,380px)_1fr] gap-4 mt-5">
        {/* Lista */}
        <div className="space-y-2">
          {conferencias.map(c => {
            const active = c.id === sel.id
            return (
              <button key={c.id} onClick={() => setSelId(c.id)} className="w-full text-left rounded-xl p-3 transition-all card"
                style={active ? { boxShadow: `0 0 0 2px ${T.brand}`, borderColor: 'transparent' } : {}}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{c.fornecedorNome}</p>
                  <Badge variant={ESTADO_TONE[c.estado]} dot>{ESTADO_CONFERENCIA_LABEL[c.estado]}</Badge>
                </div>
                <p className="text-[11.5px] text-[var(--muted)] truncate mt-0.5 font-mono">{c.documentoFatura}</p>
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <span className="text-[11px] text-[var(--muted)]">{fmtData(c.dataRececao)}</span>
                  {c.valorACreditar > 0 && (
                    <span className="text-[12px] font-bold tnum" style={{ color: T.citrus }}>{eur(c.valorACreditar)}</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Detalhe */}
        <div className="card overflow-hidden flex flex-col">
          <DetalheConferencia conf={sel} onPedir={pedirCreditacao} />
        </div>
      </div>
    </div>
  )
}

// ─── Detalhe da conferência ──────────────────────────────────────────────────
function DetalheConferencia({ conf, onPedir }: { conf: Conferencia; onPedir: () => void }) {
  return (
    <>
      {/* Cabeçalho */}
      <div className="px-5 py-4 border-b" style={{ borderColor: T.line, background: 'linear-gradient(180deg,#FAFBFA,#fff)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: T.brandSoft }}>
                <PackageCheck size={14} style={{ color: T.brandDark }} />
              </span>
              <h2 className="text-[15px] font-bold text-[var(--ink)] truncate">{conf.fornecedorNome}</h2>
              <Badge variant={ESTADO_TONE[conf.estado]} dot>{ESTADO_CONFERENCIA_LABEL[conf.estado]}</Badge>
            </div>
            <p className="text-[11.5px] text-[var(--muted)] mt-1.5">
              Fatura <span className="font-mono">{conf.documentoFatura}</span> · rececionada {fmtData(conf.dataRececao)}
            </p>
          </div>
          {conf.valorACreditar > 0 && (
            <div className="text-right shrink-0">
              <p className="text-[10px] uppercase tracking-wide text-[var(--muted)] font-semibold">A creditar</p>
              <p className="text-[20px] font-bold tnum leading-none mt-1" style={{ color: T.citrus }}>{eur(conf.valorACreditar)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Linhas */}
      <div className="flex-1 overflow-x-auto">
        <table className="dtable">
          <thead>
            <tr>
              <th>Artigo</th>
              <th style={{ textAlign: 'right' }}>Faturada</th>
              <th style={{ textAlign: 'right', color: T.brandDark }}>Recebida (báscula)</th>
              <th style={{ textAlign: 'right' }}>Diferença</th>
              <th style={{ textAlign: 'right' }}>Impacto</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {conf.linhas.map(l => {
              const difCor = l.diferencaKg < 0 ? T.tomato : l.diferencaKg > 0 ? T.brand : T.muted
              return (
                <tr key={l.id}>
                  <td className="font-medium text-[var(--ink)]">{l.artigoNome}</td>
                  <td className="tnum text-[var(--sub)]" style={{ textAlign: 'right' }}>{kg(l.qtdFaturadaKg, 2)}</td>
                  <td className="tnum font-bold" style={{ textAlign: 'right', color: T.forest }}>{kg(l.qtdRecebidaKg, 2)}</td>
                  <td className="tnum font-semibold" style={{ textAlign: 'right', color: difCor }}>
                    <span className="inline-flex items-center gap-1 justify-end">
                      {l.diferencaKg < 0 && <ArrowDownRight size={12} />}
                      {l.diferencaKg > 0 && <ArrowUpRight size={12} />}
                      {l.diferencaKg > 0 ? '+' : ''}{kg(l.diferencaKg, 2)}
                    </span>
                  </td>
                  <td className="tnum" style={{ textAlign: 'right', color: l.diferencaValor < 0 ? T.tomato : T.muted }}>
                    {l.diferencaValor !== 0 ? eur(l.diferencaValor) : '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Badge variant={LINHA_TONE[l.estado]}>{LINHA_LABEL[l.estado]}</Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: T.surfaceAlt }}>
              <td className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: T.muted }} colSpan={4}>
                Total faturado {eur(conf.totalFaturado)}
              </td>
              <td className="tnum font-bold" style={{ textAlign: 'right', color: conf.valorACreditar > 0 ? T.citrus : T.muted }}>
                {conf.valorACreditar > 0 ? eur(conf.valorACreditar) : '—'}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Rodapé de ações */}
      <div className="px-5 py-3.5 border-t flex items-center justify-between gap-3" style={{ borderColor: T.line }}>
        <div className="text-[12px] text-[var(--sub)]">
          {conf.estado === 'conforme' && (
            <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: T.brand }}>
              <CheckCircle2 size={14} /> Sem discrepâncias — mercadoria conforme à fatura.
            </span>
          )}
          {conf.estado === 'com-discrepancia' && (
            <span className="inline-flex items-center gap-1.5" style={{ color: '#9A5C06' }}>
              <AlertTriangle size={14} /> Falha de entrega detetada. Prepara-se nota de crédito ao fornecedor.
            </span>
          )}
          {conf.estado === 'creditacao-pedida' && (
            <span className="inline-flex items-center gap-1.5" style={{ color: T.sky }}>
              <Send size={14} /> Pedido de creditação enviado ao fornecedor.
            </span>
          )}
          {conf.estado === 'resolvida' && (
            <span className="inline-flex items-center gap-1.5 text-[var(--muted)]">
              <CheckCircle2 size={14} /> Creditação aceite e regularizada.
            </span>
          )}
        </div>

        {conf.estado === 'com-discrepancia' && (
          <Button onClick={onPedir}>
            Pedir creditação ao fornecedor <HandCoins size={15} />
          </Button>
        )}
        {conf.estado === 'creditacao-pedida' && (
          <Button variant="secondary" disabled>
            Creditação pedida <CheckCircle2 size={15} />
          </Button>
        )}
      </div>
    </>
  )
}
