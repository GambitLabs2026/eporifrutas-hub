'use client'
// dashboard · visão executiva que liga os 4 módulos + alertas de cobrança automáticos · Eporifrutas Ops Hub

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Inbox, PackageCheck, Wallet, TrendingUp, MailWarning, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard, StatGrid } from '@/components/ui/stat'
import { Section } from '@/components/ui/section'
import { EmailCobrancaModal } from '@/components/cobranca/email-modal'
import { useAuth } from '@/contexts/auth-context'
import { podeFazer } from '@/lib/auth/demo-auth'
import { T, eur, eur0, kg } from '@/lib/ui/theme'
import {
  ENCOMENDAS, CONFERENCIAS, VENDAS_MENSAIS,
  kpisEncomendas, kpisConferencias,
  ESTADO_ENCOMENDA_LABEL, ACAO_COBRANCA_LABEL, CANAL_LABEL,
} from '@/lib/mock'
import { prazosPorDefeito, resumoCobranca, type AlertaVivo } from '@/lib/cobranca/engine'
import { faturasLiquidadas } from '@/lib/cobranca/phc-sync'
import { carregarPrazos, carregarEmailsEnviados, marcarEmailEnviado, carregarDocsLidos } from '@/lib/cobranca/store'

export default function DashboardPage() {
  const enc = kpisEncomendas()
  const cnf = kpisConferencias()
  const { user } = useAuth()
  const canEnviar = user ? podeFazer(user.role, 'cobranca.enviar') : false
  const [metrica, setMetrica] = useState<'valor' | 'kg'>('valor')
  const [prazos, setPrazos] = useState<Record<string, number>>(() => prazosPorDefeito())
  const [emails, setEmails] = useState<Record<string, string>>({})
  const [docsLidos, setDocsLidos] = useState<string[]>([])
  const [emailAlerta, setEmailAlerta] = useState<AlertaVivo | null>(null)

  useEffect(() => { setPrazos(carregarPrazos()); setEmails(carregarEmailsEnviados()); setDocsLidos(carregarDocsLidos()) }, [])

  const liquidadas = useMemo(() => faturasLiquidadas(docsLidos), [docsLidos])
  const { alertas, totalVencido, numClientes, porEnviar } = useMemo(() => resumoCobranca(prazos, emails, liquidadas), [prazos, emails, liquidadas])
  const onEnviarEmail = (id: string) => setEmails(marcarEmailEnviado(id, new Date().toISOString()))

  const porValidar = ENCOMENDAS.filter(e => ['extraida', 'em-validacao', 'erro'].includes(e.estado)).slice(0, 4)
  const discrepancias = CONFERENCIAS.filter(c => c.estado === 'com-discrepancia' || c.estado === 'creditacao-pedida').slice(0, 3)
  const topAlertas = alertas.slice(0, 4)
  const max = Math.max(...VENDAS_MENSAIS.map(v => (metrica === 'valor' ? v.valor : v.kg)))
  const ultimo = VENDAS_MENSAIS[VENDAS_MENSAIS.length - 1]

  return (
    <div>
      <PageHeader title="Painel de Gestão" description="Estado da operação pré-PHC — receção, conferência, cobranças e tendências num só ecrã." />

      {/* Alerta automático de cobrança (ecrã principal) */}
      {numClientes > 0 && (
        <Link href="/conta-corrente" className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4 card-hover"
          style={{ backgroundColor: T.tomatoSoft, border: `1px solid #F3D2CA` }}>
          <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: '#fff' }}><MailWarning size={18} style={{ color: T.tomato }} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-bold" style={{ color: '#B23A20' }}>{numClientes} clientes ultrapassaram o prazo de pagamento</p>
            <p className="text-[12px]" style={{ color: '#9A4B36' }}>{eur0(totalVencido)} em atraso · {porEnviar} cobrança{porEnviar !== 1 ? 's' : ''} por enviar</p>
          </div>
          <span className="text-[12px] font-semibold inline-flex items-center gap-1 shrink-0" style={{ color: T.tomato }}>Tratar cobranças <ArrowRight size={14} /></span>
        </Link>
      )}

      <StatGrid cols={4}>
        <StatCard href="/encomendas" icon={Inbox} tone="brand" value={String(enc.porValidar)} label="Encomendas por validar" hint={`${kg(enc.totalKgPorValidar)} a registar no PHC`} />
        <StatCard href="/conferencia" icon={PackageCheck} tone="citrus" value={eur0(cnf.valorACreditar)} label="A creditar a fornecedores" hint={`${cnf.comDiscrepancia} conferências c/ discrepância`} />
        <StatCard href="/conta-corrente" icon={Wallet} tone="danger" value={eur0(totalVencido)} label="Total vencido" hint={`${numClientes} clientes em atraso`} />
        <StatCard href="/analise" icon={TrendingUp} tone="success" value={eur0(ultimo.valor)} label="Faturação (Jul)" delta={3.9} />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Section title="Receção de Encomendas" subtitle="A aguardar validação humana" icon={Inbox} href="/encomendas">
          <ul className="divide-y" style={{ borderColor: T.line }}>
            {porValidar.map(e => (
              <li key={e.id}>
                <Link href="/encomendas" className="flex items-center justify-between gap-2 py-2.5 -mx-1 px-1 rounded-lg hover:bg-[var(--surface-alt)] transition-colors">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{e.clienteNome}</p>
                    <p className="text-[11px] text-[var(--muted)] truncate">{e.ficheiro}</p>
                  </div>
                  <Badge variant={e.estado === 'erro' ? 'danger' : e.estado === 'em-validacao' ? 'warning' : 'violet'} dot>{ESTADO_ENCOMENDA_LABEL[e.estado]}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Receção vs. Faturação" subtitle="Discrepâncias a creditar" icon={PackageCheck} href="/conferencia">
          <ul className="divide-y" style={{ borderColor: T.line }}>
            {discrepancias.map(c => (
              <li key={c.id} className="flex items-center justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{c.fornecedorNome}</p>
                  <p className="text-[11px] text-[var(--muted)] truncate">{c.documentoFatura}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold tnum" style={{ color: T.citrus }}>{eur(c.valorACreditar)}</p>
                  <Badge variant={c.estado === 'creditacao-pedida' ? 'info' : 'warning'}>{c.estado === 'creditacao-pedida' ? 'Pedida' : 'Por pedir'}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* Cobranças com ação de email direto */}
        <Section title="Cobranças" subtitle="Passaram o prazo — enviar email" icon={Wallet} href="/conta-corrente">
          <div className="space-y-1.5">
            {topAlertas.map(a => (
              <div key={a.cliente.id} className="flex items-center justify-between gap-2 py-1.5">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{a.cliente.nome}</p>
                  <p className="text-[11px] text-[var(--muted)]">{a.diasAtrasoMax} dias · {CANAL_LABEL[a.canal]} · {ACAO_COBRANCA_LABEL[a.acao]}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <p className="text-[13px] font-bold tnum" style={{ color: T.tomato }}>{eur0(a.valorVencido)}</p>
                  {a.emailEnviadoEm
                    ? <span title="Email enviado"><CheckCircle2 size={16} style={{ color: T.brand }} /></span>
                    : canEnviar && <Button size="sm" variant="secondary" onClick={() => setEmailAlerta(a)}><Mail size={13} /></Button>}
                </div>
              </div>
            ))}
            {topAlertas.length === 0 && <p className="text-[12px] text-[var(--muted)] py-4 text-center">Sem cobranças pendentes.</p>}
          </div>
        </Section>
      </div>

      <Section className="mt-4" title="Faturação — últimos 12 meses" subtitle="A nossa análise · comparável com o PHC" icon={TrendingUp}
        action={
          <div className="flex rounded-lg p-0.5 text-[12px] font-semibold" style={{ backgroundColor: T.surfaceAlt, border: `1px solid ${T.line}` }}>
            {(['valor', 'kg'] as const).map(m => (
              <button key={m} onClick={() => setMetrica(m)} className="px-3 py-1 rounded-md transition-colors"
                style={metrica === m ? { backgroundColor: '#fff', color: T.ink, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' } : { color: T.muted }}>
                {m === 'valor' ? '€' : 'Kg'}
              </button>
            ))}
          </div>
        }>
        <div>
          <div className="flex items-end gap-2.5" style={{ height: 168 }}>
            {VENDAS_MENSAIS.map((v, i) => {
              const val = metrica === 'valor' ? v.valor : v.kg
              const ult = i === VENDAS_MENSAIS.length - 1
              return (
                <div key={i} className="flex-1 rounded-t-md relative transition-all group" style={{ height: `${Math.max((val / max) * 100, 2)}%`, backgroundColor: ult ? T.brand : '#D2E7D8' }}
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
              <span key={i} className="flex-1 text-center text-[10px] text-[var(--muted)]">{v.mes}</span>
            ))}
          </div>
        </div>
      </Section>

      {emailAlerta && <EmailCobrancaModal alerta={emailAlerta} onClose={() => setEmailAlerta(null)} onEnviar={onEnviarEmail} />}
    </div>
  )
}
