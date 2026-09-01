'use client'
// vasilhame · Gestão de Vasilhame — recolha por camião (GPS→cliente), validação de saldo, nota + email
// Eporifrutas Ops Hub. Tudo ao peso: cada SKU tem tara (Kg) que entra no peso líquido.

import { Fragment, useMemo, useState } from 'react'
import {
  Recycle, Truck, MapPin, FileText, Mail, CheckCircle2, AlertTriangle, Send, ChevronRight, Boxes, Weight, Euro,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard, StatGrid } from '@/components/ui/stat'
import { Section } from '@/components/ui/section'
import { Modal } from '@/components/ui/modal'
import { T, eur, kg, num, type Tone } from '@/lib/ui/theme'
import {
  RECOLHAS, VASILHAME_SKUS, VASILHAME_SKU_POR_ID, SALDOS_VASILHAME,
  saldosDoCliente, saldoDe, saldoTotalCliente, taraTotalRecolha, kpisVasilhame,
  ESTADO_RECOLHA_LABEL, TIPO_VASILHAME_LABEL, CLIENTE_POR_ID,
  type Recolha, type EstadoRecolha,
} from '@/lib/mock'

const ESTADO_TONE: Record<EstadoRecolha, Tone> = {
  'em-curso': 'warning', registada: 'info', 'nota-emitida': 'violet', concluida: 'success',
}

export default function VasilhamePage() {
  const k = kpisVasilhame()
  const [recolhas, setRecolhas] = useState<Recolha[]>(() => JSON.parse(JSON.stringify(RECOLHAS)))
  const [selId, setSelId] = useState<string>(RECOLHAS[0].id)
  const [emitir, setEmitir] = useState(false)
  const [cliAberto, setCliAberto] = useState<string | null>(null)

  const sel = recolhas.find((r) => r.id === selId) ?? recolhas[0]

  // Validação: não pode devolver mais do que o saldo em posse
  const linhasVal = sel.linhas.map((l) => {
    const saldo = saldoDe(sel.clienteId, l.skuId)
    return { ...l, sku: VASILHAME_SKU_POR_ID[l.skuId], saldo, excede: l.quantidade > saldo }
  })
  const temExcesso = linhasVal.some((l) => l.excede)
  const taraTotal = taraTotalRecolha(sel)
  const jaEmitida = sel.estado === 'nota-emitida' || sel.estado === 'concluida'

  const confirmarEmissao = () => {
    const ref = `ND 2026/${String(500 + recolhas.filter((r) => r.notaDevolucao).length + 1).padStart(4, '0')}`
    setRecolhas((prev) => prev.map((r) => r.id !== sel.id ? r : { ...r, estado: 'nota-emitida', notaDevolucao: ref, emailEnviadoEm: new Date().toISOString() }))
    setEmitir(false)
  }

  // Saldos por cliente (agregado)
  const clientesComSaldo = useMemo(() => {
    const ids = Array.from(new Set(SALDOS_VASILHAME.map((s) => s.clienteId)))
    return ids.map((id) => {
      const linhas = saldosDoCliente(id)
      const valor = linhas.reduce((t, l) => t + l.saldo * l.sku.valorDeposito, 0)
      return { id, nome: CLIENTE_POR_ID[id]?.nome ?? id, total: saldoTotalCliente(id), valor, linhas }
    }).sort((a, b) => b.valor - a.valor)
  }, [])

  return (
    <div>
      <PageHeader title="Gestão de Vasilhame" description="Recolha de vasilhame retornável por camião (≈20 SKUs). GPS identifica o cliente, valida o saldo, emite nota de devolução e envia email. Tudo ao peso — cada SKU tem tara." />

      <StatGrid cols={4}>
        <StatCard icon={Boxes} tone="brand" value={num(k.emCirculacao)} label="Vasilhame em circulação" hint="unidades em posse de clientes" />
        <StatCard icon={Euro} tone="citrus" value={eur(k.valorCirculacao)} label="Valor em circulação" hint="depósito de vasilhame" />
        <StatCard icon={Truck} tone="neutral" value={String(k.recolhasHoje)} label="Recolhas hoje" hint="camiões em rota" />
        <StatCard icon={AlertTriangle} tone="warning" value={String(k.pendentes)} label="Pendentes" hint="por emitir nota" />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,360px)_1fr] gap-4 mt-5">
        {/* Lista de recolhas */}
        <div className="space-y-2">
          {recolhas.map((r) => {
            const active = r.id === sel.id
            return (
              <button key={r.id} onClick={() => setSelId(r.id)} className="w-full text-left rounded-xl p-3 transition-all card"
                style={active ? { boxShadow: `0 0 0 2px ${T.brand}`, borderColor: 'transparent' } : {}}>
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: T.brandSoft }}>
                    <Truck size={16} style={{ color: T.brandDark }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{r.clienteNome}</p>
                      <Badge variant={ESTADO_TONE[r.estado]} dot>{ESTADO_RECOLHA_LABEL[r.estado]}</Badge>
                    </div>
                    <p className="text-[11.5px] text-[var(--muted)] truncate mt-0.5 inline-flex items-center gap-1"><MapPin size={11} /> {r.localizacao}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[var(--muted)]">
                      <span className="font-mono">{r.referencia}</span><span>·</span><span>{r.linhas.length} SKUs</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Detalhe da recolha */}
        <div className="card overflow-hidden flex flex-col">
          {/* GPS → cliente identificado */}
          <div className="px-5 py-3.5 border-b flex items-center gap-3" style={{ borderColor: T.line, backgroundColor: '#EEF6FF' }}>
            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: '#fff' }}><MapPin size={17} style={{ color: T.sky }} /></span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#1F6B88' }}>Localização detetada (GPS {sel.coords})</p>
              <p className="text-[13px] font-semibold text-[var(--ink)] mt-0.5">{sel.localizacao} → cliente identificado: <span style={{ color: T.brandDark }}>{sel.clienteNome}</span></p>
            </div>
          </div>

          {/* Cabeçalho */}
          <div className="px-5 py-3 border-b flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: T.line }}>
            <div className="text-[12px] text-[var(--sub)]">
              <span className="font-mono font-semibold text-[var(--ink)]">{sel.referencia}</span> · Motorista: {sel.motorista}
              <Badge variant={ESTADO_TONE[sel.estado]} className="ml-2">{ESTADO_RECOLHA_LABEL[sel.estado]}</Badge>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: T.forest }}>
              <Weight size={14} /> Tara total: <span className="tnum">{kg(taraTotal, 1)}</span>
            </div>
          </div>

          {/* Linhas com validação de saldo */}
          <div className="flex-1 overflow-x-auto">
            <table className="dtable">
              <thead>
                <tr>
                  <th>SKU de vasilhame</th><th style={{ textAlign: 'right' }}>A devolver</th>
                  <th style={{ textAlign: 'right' }}>Saldo em posse</th><th style={{ textAlign: 'right' }}>Tara (Kg)</th><th style={{ textAlign: 'center' }}>Validação</th>
                </tr>
              </thead>
              <tbody>
                {linhasVal.map((l) => (
                  <tr key={l.skuId}>
                    <td>
                      <span className="font-medium text-[var(--ink)]">{l.sku?.nome}</span>
                      <span className="ml-1.5 font-mono text-[10px] px-1 py-0.5 rounded" style={{ backgroundColor: T.brandSoft, color: T.brandDark }}>{l.sku?.codigo}</span>
                    </td>
                    <td className="tnum font-semibold" style={{ textAlign: 'right', color: T.ink }}>{num(l.quantidade)}</td>
                    <td className="tnum" style={{ textAlign: 'right', color: T.sub }}>{num(l.saldo)}</td>
                    <td className="tnum" style={{ textAlign: 'right', color: T.sub }}>{kg((l.sku?.taraKg ?? 0) * l.quantidade, 1)}</td>
                    <td style={{ textAlign: 'center' }}>
                      {l.excede
                        ? <Badge variant="danger" dot>Excede o saldo</Badge>
                        : <Badge variant="success" dot>OK</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rodapé de ações */}
          <div className="px-5 py-3.5 border-t flex items-center justify-between gap-3" style={{ borderColor: T.line }}>
            <div className="text-[12px]">
              {jaEmitida
                ? <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: T.brand }}><CheckCircle2 size={14} /> {sel.notaDevolucao} · email enviado ao cliente</span>
                : temExcesso
                  ? <span className="inline-flex items-center gap-1.5" style={{ color: T.tomato }}><AlertTriangle size={14} /> Não pode devolver mais do que foi entregue — corrigir linhas</span>
                  : <span className="inline-flex items-center gap-1.5 text-[var(--sub)]"><FileText size={14} className="text-[var(--muted)]" /> Pronto a emitir nota de devolução</span>}
            </div>
            <Button onClick={() => setEmitir(true)} disabled={jaEmitida || temExcesso}>
              {jaEmitida ? <>Nota emitida <CheckCircle2 size={15} /></> : <>Emitir nota + email <FileText size={14} /></>}
            </Button>
          </div>
        </div>
      </div>

      {/* Saldos de vasilhame por cliente */}
      <Section className="mt-4" title="Saldos de vasilhame por cliente" subtitle="Vasilhame entregue por regularizar (entregue − devolvido)" icon={Recycle} flush>
        <div className="overflow-x-auto">
          <table className="dtable">
            <thead>
              <tr><th>Cliente</th><th style={{ textAlign: 'right' }}>Em posse (un.)</th><th style={{ textAlign: 'right' }}>Valor depósito</th></tr>
            </thead>
            <tbody>
              {clientesComSaldo.map((c) => {
                const active = c.id === cliAberto
                return (
                  <Fragment key={c.id}>
                    <tr className={`clickable${active ? ' selected' : ''}`} onClick={() => setCliAberto(active ? null : c.id)}>
                      <td>
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--ink)]">
                          <ChevronRight size={13} style={{ color: T.muted, transform: active ? 'rotate(90deg)' : 'none' }} />
                          <span className="truncate">{c.nome}</span>
                        </span>
                      </td>
                      <td className="tnum font-semibold" style={{ textAlign: 'right', color: T.forest }}>{num(c.total)}</td>
                      <td className="tnum" style={{ textAlign: 'right', color: T.sub }}>{eur(c.valor)}</td>
                    </tr>
                    {active && c.linhas.map((l) => (
                      <tr key={c.id + l.sku.id} style={{ backgroundColor: T.surfaceAlt }}>
                        <td style={{ paddingLeft: 34 }} className="text-[12px] text-[var(--sub)]">{l.sku.nome} <span className="font-mono text-[10px] text-[var(--muted)]">{l.sku.codigo}</span></td>
                        <td className="tnum text-[12px]" style={{ textAlign: 'right', color: T.sub }}>{num(l.saldo)} <span className="text-[var(--muted)]">({num(l.entregue)}↓ / {num(l.devolvido)}↑)</span></td>
                        <td className="tnum text-[12px]" style={{ textAlign: 'right', color: T.muted }}>{eur(l.saldo * l.sku.valorDeposito)}</td>
                      </tr>
                    ))}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Catálogo de SKUs */}
      <Section className="mt-4" title="SKUs de vasilhame" subtitle={`${VASILHAME_SKUS.length} tipos · tara (Kg) e valor de depósito`} icon={Boxes} flush>
        <div className="overflow-x-auto">
          <table className="dtable">
            <thead>
              <tr><th>Código</th><th>Designação</th><th>Tipo</th><th style={{ textAlign: 'right' }}>Tara (Kg)</th><th style={{ textAlign: 'right' }}>Depósito</th></tr>
            </thead>
            <tbody>
              {VASILHAME_SKUS.map((v) => (
                <tr key={v.id}>
                  <td className="font-mono text-[12px]" style={{ color: T.brandDark }}>{v.codigo}</td>
                  <td className="text-[var(--ink)]">{v.nome}</td>
                  <td><Badge variant="neutral">{TIPO_VASILHAME_LABEL[v.tipo]}</Badge></td>
                  <td className="tnum" style={{ textAlign: 'right', color: T.sub }}>{num(v.taraKg, 1)}</td>
                  <td className="tnum" style={{ textAlign: 'right', color: T.sub }}>{eur(v.valorDeposito)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Modal: nota de devolução + email */}
      {emitir && (
        <Modal wide title="Nota de devolução + email ao cliente" subtitle={`${sel.clienteNome} · ${sel.referencia}`} onClose={() => setEmitir(false)}
          footer={<><Button variant="secondary" onClick={() => setEmitir(false)}>Cancelar</Button><Button onClick={confirmarEmissao}>Confirmar e enviar <Send size={14} /></Button></>}>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: T.brandSoft }}><Mail size={16} style={{ color: T.brandDark }} /></span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[var(--ink)]">{sel.clienteNome}</p>
              <p className="text-[11.5px] text-[var(--muted)] font-mono">{CLIENTE_POR_ID[sel.clienteId]?.email}</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden mb-3" style={{ border: `1px solid ${T.line}` }}>
            <table className="dtable">
              <thead><tr><th>SKU devolvido</th><th style={{ textAlign: 'right' }}>Qtd</th><th style={{ textAlign: 'right' }}>Tara (Kg)</th></tr></thead>
              <tbody>
                {linhasVal.map((l) => (
                  <tr key={l.skuId}>
                    <td className="text-[var(--ink)]">{l.sku?.nome} <span className="font-mono text-[10px] text-[var(--muted)]">{l.sku?.codigo}</span></td>
                    <td className="tnum" style={{ textAlign: 'right' }}>{num(l.quantidade)}</td>
                    <td className="tnum" style={{ textAlign: 'right', color: T.sub }}>{kg((l.sku?.taraKg ?? 0) * l.quantidade, 1)}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: T.surfaceAlt }}>
                  <td className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: T.muted }}>Tara total</td>
                  <td></td>
                  <td className="tnum font-bold" style={{ textAlign: 'right', color: T.forest }}>{kg(taraTotal, 1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[12px] text-[var(--sub)]">Ao confirmar, o saldo de vasilhame do cliente é atualizado, é emitida a <b>nota de devolução</b> e enviado o email de confirmação automaticamente.</p>
        </Modal>
      )}
    </div>
  )
}
