'use client'
// conta-corrente · Módulo 3 — lê faturas E recibos do PHC · prazo por cliente · alertas + email de cobrança

import { useEffect, useMemo, useState } from 'react'
import {
  Wallet, AlertTriangle, Users, MailWarning, ChevronRight, Database, RefreshCw, CheckCircle2, Mail, Pencil, FileText, Receipt, FilePen, Lock,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard, StatGrid } from '@/components/ui/stat'
import { Section } from '@/components/ui/section'
import { EmailCobrancaModal } from '@/components/cobranca/email-modal'
import { ModeloEmailModal } from '@/components/cobranca/modelo-email-modal'
import { useAuth } from '@/contexts/auth-context'
import { podeFazer } from '@/lib/auth/demo-auth'
import { T, eur, type Tone } from '@/lib/ui/theme'
import { CLIENTES, MOVIMENTOS, ACAO_COBRANCA_LABEL, CANAL_LABEL, type Canal } from '@/lib/mock'
import {
  prazosPorDefeito, resumoCobranca, calcularAging, vencimentoDe, atrasoDe, fmtData, type AlertaVivo, type ModeloEmail,
} from '@/lib/cobranca/engine'
import { DOCS_PHC, faturasLiquidadas } from '@/lib/cobranca/phc-sync'
import {
  carregarPrazos, guardarPrazo, carregarEmailsEnviados, marcarEmailEnviado, carregarDocsLidos, guardarDocsLidos,
  carregarModelo, guardarModelo,
} from '@/lib/cobranca/store'

const CANAL_TONE: Record<Canal, Tone> = { grossista: 'neutral', horeca: 'warning', cruzeiro: 'info', supermercado: 'violet' }
const AGING = [
  { key: 'corrente', label: 'Corrente', cor: T.brand },
  { key: 'd30', label: '1–30 dias', cor: T.citrus },
  { key: 'd60', label: '31–60 dias', cor: '#E8935A' },
  { key: 'd90', label: '61–90 dias', cor: T.tomato },
  { key: 'mais90', label: '> 90 dias', cor: '#9E2F17' },
] as const

export default function ContaCorrentePage() {
  const { user } = useAuth()
  const can = (p: Parameters<typeof podeFazer>[1]) => (user ? podeFazer(user.role, p) : false)

  const [prazos, setPrazos] = useState<Record<string, number>>(() => prazosPorDefeito())
  const [emails, setEmails] = useState<Record<string, string>>({})
  const [docsLidos, setDocsLidos] = useState<string[]>([])
  const [modelo, setModelo] = useState<ModeloEmail | null>(null)
  const [modeloOpen, setModeloOpen] = useState(false)
  const [selCliente, setSelCliente] = useState<string | null>(null)
  const [emailAlerta, setEmailAlerta] = useState<AlertaVivo | null>(null)
  const [sync, setSync] = useState<'idle' | 'a-sincronizar'>('idle')
  const [ultimaSync, setUltimaSync] = useState('há 8 minutos')

  useEffect(() => { setPrazos(carregarPrazos()); setEmails(carregarEmailsEnviados()); setDocsLidos(carregarDocsLidos()); setModelo(carregarModelo()) }, [])

  const liquidadas = useMemo(() => faturasLiquidadas(docsLidos), [docsLidos])
  const pendentes = DOCS_PHC.filter(d => !docsLidos.includes(d.id))
  const { alertas, totalVencido, numClientes, porEnviar } = useMemo(() => resumoCobranca(prazos, emails, liquidadas), [prazos, emails, liquidadas])
  const aging = useMemo(() => calcularAging(prazos, liquidadas), [prazos, liquidadas])
  const agingTotal = AGING.reduce((s, b) => s + aging[b.key], 0) || 1
  const saldoTotal = useMemo(() => CLIENTES.reduce((s, c) => s + c.saldo, 0), [])
  const clientesOrdenados = useMemo(() => [...CLIENTES].sort((a, b) => b.saldo - a.saldo), [])
  const clienteSel = clientesOrdenados.find(c => c.id === selCliente)

  const editarPrazo = (id: string, dias: number) => setPrazos(guardarPrazo(id, Math.max(0, Math.min(180, dias || 0))))
  const onEnviarEmail = (clienteId: string) => setEmails(marcarEmailEnviado(clienteId, new Date().toISOString()))
  const sincronizar = () => {
    setSync('a-sincronizar')
    setTimeout(() => {
      setDocsLidos(guardarDocsLidos(DOCS_PHC.map(d => d.id)))
      setSync('idle'); setUltimaSync('agora mesmo')
    }, 1100)
  }

  return (
    <div>
      <PageHeader title="Conta-corrente & Cobranças" description="Lê do PHC as faturas e os recibos: quando entra um recibo, a fatura é liquidada e o cliente regulariza-se automaticamente." />

      {/* Barra de ligação ao ERP */}
      <div className="card px-4 py-2.5 mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 text-[12.5px]">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: T.brandSoft }}><Database size={15} style={{ color: T.brandDark }} /></span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--ink)]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: T.brand, boxShadow: '0 0 0 3px rgba(27,138,75,0.16)' }} /> Ligado ao PHC
          </span>
          <span className="text-[var(--muted)]">·{' '}
            {pendentes.length > 0
              ? <span className="font-medium" style={{ color: T.citrus }}>{pendentes.length} documentos novos por ler</span>
              : <>conta-corrente sincronizada</>}
            {' '}· última sincronização: <span className="text-[var(--sub)] font-medium">{ultimaSync}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {can('cobranca.editar-modelo') && (
            <Button size="sm" variant="secondary" onClick={() => setModeloOpen(true)}><FilePen size={13} /> Modelo de email</Button>
          )}
          {can('cobranca.sincronizar') ? (
            <Button size="sm" variant={pendentes.length > 0 ? 'primary' : 'secondary'} onClick={sincronizar} disabled={sync === 'a-sincronizar'}>
              <RefreshCw size={13} className={sync === 'a-sincronizar' ? 'animate-spin' : ''} /> {sync === 'a-sincronizar' ? 'A ler do PHC…' : 'Sincronizar'}
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]"><Lock size={12} /> só leitura</span>
          )}
        </div>
      </div>

      <StatGrid cols={4}>
        <StatCard icon={AlertTriangle} tone="danger" value={eur(totalVencido)} label="Total vencido" hint="a cobrar com prioridade" />
        <StatCard icon={Users} tone="warning" value={String(numClientes)} label="Clientes em atraso" hint="passaram o prazo definido" />
        <StatCard icon={MailWarning} tone="citrus" value={String(porEnviar)} label="Cobranças por enviar" hint="alertas sem email enviado" />
        <StatCard icon={Wallet} tone="brand" value={eur(saldoTotal)} label="Saldo total em aberto" hint="conta-corrente global" />
      </StatGrid>

      {/* Leitura automática do PHC (faturas + recibos) */}
      <Section className="mt-4" title="Leitura automática do PHC" subtitle={pendentes.length > 0 ? `${pendentes.length} documentos por ler — sincronize para atualizar a conta-corrente` : 'Todos os documentos lidos e aplicados'} icon={Database} flush>
        <div className="divide-y" style={{ borderColor: T.line }}>
          {DOCS_PHC.map(d => {
            const lido = docsLidos.includes(d.id)
            const isRecibo = d.tipo === 'recibo'
            return (
              <div key={d.id} className="flex items-center gap-3 px-5 py-2.5" style={{ opacity: lido ? 1 : 0.62 }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: isRecibo ? T.brandSoft : T.skySoft }}>
                  {isRecibo ? <Receipt size={15} style={{ color: T.brandDark }} /> : <FileText size={15} style={{ color: '#1F6B88' }} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[var(--ink)]">
                    <span className="font-mono">{d.documento}</span> · {d.clienteNome}
                  </p>
                  <p className="text-[11.5px] text-[var(--muted)]">
                    {isRecibo ? <>Recibo — liquida <span className="font-mono">{d.liquida}</span></> : 'Fatura criada no PHC'}
                    {' · '}{eur(d.valor)}
                  </p>
                </div>
                {lido
                  ? isRecibo
                    ? <Badge variant="success" dot><CheckCircle2 size={12} /> Cliente regularizado</Badge>
                    : <Badge variant="info" dot>Fatura lida</Badge>
                  : <Badge variant="warning" dot>Por ler</Badge>}
              </div>
            )
          })}
        </div>
      </Section>

      {/* Aging */}
      <div className="card p-5 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[13.5px] font-bold text-[var(--ink)]">Antiguidade de saldos (aging)</h3>
            <p className="text-[11.5px] text-[var(--muted)] mt-0.5">Recalculada com os prazos por cliente e os recibos lidos do PHC</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wide text-[var(--muted)] font-semibold">Total em aberto</p>
            <p className="text-[18px] font-bold tnum leading-none mt-1" style={{ color: T.forest }}>{eur(agingTotal)}</p>
          </div>
        </div>
        <div className="flex h-4 rounded-full overflow-hidden mb-4" style={{ backgroundColor: T.surfaceAlt }}>
          {AGING.map(b => aging[b.key] > 0 && (
            <div key={b.key} title={`${b.label}: ${eur(aging[b.key])}`} style={{ width: `${(aging[b.key] / agingTotal) * 100}%`, backgroundColor: b.cor }} />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {AGING.map(b => (
            <div key={b.key} className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-sm mt-1 shrink-0" style={{ backgroundColor: b.cor }} />
              <div className="min-w-0">
                <p className="text-[11px] text-[var(--muted)] truncate">{b.label}</p>
                <p className="text-[13px] font-semibold text-[var(--ink)] tnum">{eur(aging[b.key])}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-4 mt-4">
        {/* Alertas automáticos */}
        <Section title="Alertas de cobrança automáticos" subtitle={`${alertas.length} clientes passaram o prazo · ordenados por valor`} icon={AlertTriangle}>
          <div className="space-y-2.5">
            {alertas.map(a => (
              <div key={a.cliente.id} className="rounded-xl border p-3" style={{ borderColor: T.line, backgroundColor: T.surfaceAlt }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{a.cliente.nome}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <Badge variant={CANAL_TONE[a.canal]}>{CANAL_LABEL[a.canal]}</Badge>
                      <Badge variant="danger" dot>{a.diasAtrasoMax} dias</Badge>
                      <span className="text-[11px] text-[var(--muted)]">{a.docs.length} doc{a.docs.length !== 1 ? 's' : ''} · prazo {prazos[a.cliente.id] ?? a.cliente.prazoPagamentoDias}d</span>
                    </div>
                  </div>
                  <p className="text-[15px] font-bold tnum shrink-0" style={{ color: T.tomato }}>{eur(a.valorVencido)}</p>
                </div>
                <div className="flex items-center justify-between gap-2 mt-2.5">
                  <span className="text-[12px] text-[var(--sub)]">Ação: <span className="font-medium text-[var(--ink)]">{ACAO_COBRANCA_LABEL[a.acao]}</span></span>
                  {a.emailEnviadoEm
                    ? <Badge variant="success" dot><CheckCircle2 size={12} /> Email enviado</Badge>
                    : can('cobranca.enviar')
                      ? <Button size="sm" onClick={() => setEmailAlerta(a)}><Mail size={13} /> Enviar email</Button>
                      : <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]"><Lock size={11} /> sem permissão</span>}
                </div>
              </div>
            ))}
            {alertas.length === 0 && <p className="text-[13px] text-[var(--muted)] py-6 text-center">Sem clientes em atraso. 🎉</p>}
          </div>
        </Section>

        {/* Clientes — prazo editável + saldos */}
        <Section title="Clientes — prazo & saldo" subtitle="Edite o prazo de pagamento (dias) por cliente" icon={Wallet} flush>
          <div className="overflow-x-auto">
            <table className="dtable">
              <thead>
                <tr><th>Cliente</th><th>Canal</th><th style={{ textAlign: 'center' }}>Prazo (dias)</th><th style={{ textAlign: 'right' }}>Saldo</th></tr>
              </thead>
              <tbody>
                {clientesOrdenados.map(c => {
                  const active = c.id === selCliente
                  return (
                    <tr key={c.id} className={`clickable${active ? ' selected' : ''}`} onClick={() => setSelCliente(active ? null : c.id)}>
                      <td>
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--ink)]">
                          <ChevronRight size={13} className="shrink-0" style={{ color: T.muted, transform: active ? 'rotate(90deg)' : 'none' }} />
                          <span className="truncate">{c.nome}</span>
                        </span>
                      </td>
                      <td><Badge variant={CANAL_TONE[c.canal]}>{CANAL_LABEL[c.canal]}</Badge></td>
                      <td style={{ textAlign: 'center' }}>
                        {can('cobranca.editar-prazo') ? (
                          <span className="inline-flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <input type="number" value={prazos[c.id] ?? c.prazoPagamentoDias} min={0} max={180}
                              onChange={e => editarPrazo(c.id, Number(e.target.value))}
                              className="w-14 rounded-md px-1.5 py-1 text-[13px] text-center tnum ring-focus" style={{ border: `1px solid ${T.line}` }} />
                            <Pencil size={11} style={{ color: T.muted }} />
                          </span>
                        ) : <span className="text-[13px] text-[var(--sub)] tnum">{prazos[c.id] ?? c.prazoPagamentoDias} d</span>}
                      </td>
                      <td className="tnum font-semibold" style={{ textAlign: 'right', color: c.saldo > 0 ? T.forest : T.muted }}>{eur(c.saldo)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* Drill-down: movimentos do cliente */}
      {clienteSel && (
        <Section className="mt-4" title={`Movimentos · ${clienteSel.nome}`} subtitle={`Conta-corrente detalhada · prazo ${prazos[clienteSel.id] ?? clienteSel.prazoPagamentoDias} dias`} icon={Database} flush>
          <div className="overflow-x-auto">
            <table className="dtable">
              <thead>
                <tr><th>Documento</th><th>Emissão</th><th>Vencimento</th><th style={{ textAlign: 'center' }}>Estado</th><th style={{ textAlign: 'right' }}>Valor</th></tr>
              </thead>
              <tbody>
                {MOVIMENTOS.filter(m => m.clienteId === clienteSel.id).map(m => {
                  const prazo = prazos[clienteSel.id] ?? clienteSel.prazoPagamentoDias
                  const isFatura = m.tipo === 'fatura'
                  const liquidada = isFatura && liquidadas.has(m.documento)
                  const venc = isFatura ? vencimentoDe(m.data, prazo) : null
                  const atraso = venc ? atrasoDe(venc) : 0
                  const estado = !isFatura ? (m.tipo === 'pagamento' ? 'Pagamento' : 'Nota de crédito')
                    : (m.estado === 'pago' || liquidada) ? (liquidada ? 'Pago (recibo)' : 'Pago')
                      : atraso > 0 ? 'Vencido' : 'Pendente'
                  const tone: Tone = estado === 'Vencido' ? 'danger' : estado === 'Pendente' ? 'warning' : estado === 'Pago (recibo)' ? 'brand' : 'success'
                  return (
                    <tr key={m.id}>
                      <td className="font-mono text-[12px] text-[var(--sub)]">{m.documento}</td>
                      <td className="text-[12px] text-[var(--sub)]">{fmtData(new Date(m.data + 'T00:00:00'))}</td>
                      <td className="text-[12px] text-[var(--sub)]">
                        {venc ? fmtData(venc) : '—'}
                        {atraso > 0 && !liquidada && <span className="ml-1 text-[10px] font-semibold" style={{ color: T.tomato }}>+{atraso}d</span>}
                      </td>
                      <td style={{ textAlign: 'center' }}><Badge variant={tone}>{estado}</Badge></td>
                      <td className="tnum font-semibold" style={{ textAlign: 'right', color: m.valor < 0 ? T.brand : T.ink }}>{eur(m.valor)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {emailAlerta && <EmailCobrancaModal alerta={emailAlerta} onClose={() => setEmailAlerta(null)} onEnviar={onEnviarEmail} />}
      {modeloOpen && modelo && <ModeloEmailModal modelo={modelo} onClose={() => setModeloOpen(false)} onGuardar={m => setModelo(guardarModelo(m))} />}
    </div>
  )
}
