'use client'
// clientes · carteira por canal (grossistas, HORECA, navios, supermercados) — ficha + conta-corrente (demo) · Eporifrutas Hub

import { useMemo, useState } from 'react'
import {
  Users, Warehouse, UtensilsCrossed, Ship, ShoppingCart, Search,
  Mail, Phone, Hash, CalendarClock, Wallet, FileText,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal, Field } from '@/components/ui/modal'
import { StatCard, StatGrid } from '@/components/ui/stat'
import { T, eur, type Tone } from '@/lib/ui/theme'
import {
  CLIENTES, MOVIMENTOS, CANAL_LABEL, FORMATO_LABEL,
  type Cliente, type Canal, type Movimento, type EstadoMovimento,
} from '@/lib/mock'

const CANAL_TONE: Record<Canal, Tone> = {
  grossista: 'info', horeca: 'violet', cruzeiro: 'warning', supermercado: 'success',
}
const MOV_TONE: Record<EstadoMovimento, Tone> = {
  pago: 'success', pendente: 'warning', vencido: 'danger',
}
const MOV_LABEL: Record<EstadoMovimento, string> = {
  pago: 'Pago', pendente: 'Pendente', vencido: 'Vencido',
}

export default function ClientesPage() {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<Canal | 'todos'>('todos')
  const [selId, setSelId] = useState<string | null>(null)

  const kpis = useMemo(() => {
    const porCanal = (canal: Canal) => CLIENTES.filter(c => c.canal === canal).length
    return {
      total: CLIENTES.length,
      grossista: porCanal('grossista'),
      horeca: porCanal('horeca'),
      cruzeiro: porCanal('cruzeiro'),
      supermercado: porCanal('supermercado'),
    }
  }, [])

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return CLIENTES.filter(c => {
      if (filtro !== 'todos' && c.canal !== filtro) return false
      if (!q) return true
      return c.nome.toLowerCase().includes(q) || c.localidade.toLowerCase().includes(q)
    })
  }, [busca, filtro])

  const sel = selId ? CLIENTES.find(c => c.id === selId) ?? null : null

  const filtros: { key: Canal | 'todos'; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'grossista', label: CANAL_LABEL.grossista },
    { key: 'horeca', label: CANAL_LABEL.horeca },
    { key: 'cruzeiro', label: CANAL_LABEL.cruzeiro },
    { key: 'supermercado', label: CANAL_LABEL.supermercado },
  ]

  return (
    <div>
      <PageHeader title="Clientes" description="Carteira por canal — grossistas, HORECA, navios e supermercados." />

      <StatGrid cols={5}>
        <StatCard icon={Users} tone="brand" value={String(kpis.total)} label="Total de clientes" hint="carteira ativa" />
        <StatCard icon={Warehouse} tone="info" value={String(kpis.grossista)} label={CANAL_LABEL.grossista} />
        <StatCard icon={UtensilsCrossed} tone="violet" value={String(kpis.horeca)} label={CANAL_LABEL.horeca} />
        <StatCard icon={Ship} tone="citrus" value={String(kpis.cruzeiro)} label={CANAL_LABEL.cruzeiro} />
        <StatCard icon={ShoppingCart} tone="success" value={String(kpis.supermercado)} label={CANAL_LABEL.supermercado} />
      </StatGrid>

      {/* Pesquisa + filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5 mb-4">
        <div className="relative sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Pesquisar por nome ou localidade…"
            className="w-full rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none ring-focus"
            style={{ backgroundColor: T.surfaceAlt, border: `1px solid ${T.line}`, color: T.ink }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filtros.map(f => {
            const on = filtro === f.key
            return (
              <button key={f.key} onClick={() => setFiltro(f.key)} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={on ? { backgroundColor: T.forest, color: '#fff' } : { backgroundColor: '#fff', color: T.sub, border: `1px solid ${T.line}` }}>
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tabela de clientes */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="dtable">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Canal</th>
                <th>Contacto</th>
                <th>Localidade</th>
                <th>Prazo</th>
                <th>Formato</th>
                <th style={{ textAlign: 'right' }}>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(c => (
                <tr key={c.id} className="clickable" onClick={() => setSelId(c.id)}>
                  <td>
                    <p className="font-semibold text-[var(--ink)]">{c.nome}</p>
                    <p className="text-[11px] tnum" style={{ color: T.muted }}>{c.nif}</p>
                  </td>
                  <td><Badge variant={CANAL_TONE[c.canal]}>{CANAL_LABEL[c.canal]}</Badge></td>
                  <td style={{ color: T.sub }}>{c.contactoNome}</td>
                  <td style={{ color: T.sub }}>{c.localidade}</td>
                  <td className="tnum whitespace-nowrap" style={{ color: T.sub }}>{c.prazoPagamentoDias} dias</td>
                  <td><Badge variant="neutral">{FORMATO_LABEL[c.formatoHabitual]}</Badge></td>
                  <td className="tnum font-bold whitespace-nowrap" style={{ textAlign: 'right', color: c.saldo > 0 ? T.forest : T.muted }}>
                    {eur(c.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lista.length === 0 && (
          <p className="text-[13px] py-10 text-center" style={{ color: T.muted }}>Sem clientes para esta pesquisa.</p>
        )}
      </div>

      {sel && <FichaCliente cliente={sel} onClose={() => setSelId(null)} />}
    </div>
  )
}

// ─── Ficha do cliente (modal) ────────────────────────────────────────────────
function FichaCliente({ cliente, onClose }: { cliente: Cliente; onClose: () => void }) {
  const movimentos = useMemo<Movimento[]>(
    () => MOVIMENTOS.filter(m => m.clienteId === cliente.id),
    [cliente.id],
  )

  return (
    <Modal
      wide
      title={cliente.nome}
      subtitle={`${CANAL_LABEL[cliente.canal]} · ${cliente.localidade}`}
      onClose={onClose}
      footer={<Button variant="secondary" onClick={onClose}>Fechar</Button>}
    >
      {/* Dados da ficha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Field label="Contacto">
          <p className="text-sm text-[var(--ink)]">{cliente.contactoNome}</p>
        </Field>
        <Field label="Canal">
          <div><Badge variant={CANAL_TONE[cliente.canal]}>{CANAL_LABEL[cliente.canal]}</Badge></div>
        </Field>
        <Field label="Email">
          <p className="text-sm text-[var(--ink)] inline-flex items-center gap-1.5">
            <Mail size={13} style={{ color: T.muted }} />{cliente.email}
          </p>
        </Field>
        <Field label="Telefone">
          <p className="text-sm text-[var(--ink)] inline-flex items-center gap-1.5">
            <Phone size={13} style={{ color: T.muted }} />{cliente.telefone}
          </p>
        </Field>
        <Field label="NIF">
          <p className="text-sm text-[var(--ink)] inline-flex items-center gap-1.5 tnum">
            <Hash size={13} style={{ color: T.muted }} />{cliente.nif}
          </p>
        </Field>
        <Field label="Prazo de pagamento">
          <p className="text-sm text-[var(--ink)] inline-flex items-center gap-1.5">
            <CalendarClock size={13} style={{ color: T.muted }} />{cliente.prazoPagamentoDias} dias
          </p>
        </Field>
        <Field label="Formato habitual">
          <div><Badge variant="neutral">{FORMATO_LABEL[cliente.formatoHabitual]}</Badge></div>
        </Field>
        <Field label="Saldo em conta-corrente">
          <p className="text-base font-bold inline-flex items-center gap-1.5 tnum" style={{ color: cliente.saldo > 0 ? T.forest : T.muted }}>
            <Wallet size={14} style={{ color: T.citrus }} />{eur(cliente.saldo)}
          </p>
        </Field>
      </div>

      {/* Conta-corrente / movimentos */}
      <div className="flex items-center gap-2 mb-2.5">
        <FileText size={15} style={{ color: T.brand }} />
        <h3 className="text-sm font-bold text-[var(--ink)]">Conta-corrente</h3>
        <span className="text-xs" style={{ color: T.muted }}>({movimentos.length} movimentos)</span>
      </div>
      {movimentos.length === 0 ? (
        <p className="text-sm py-6 text-center rounded-xl" style={{ color: T.muted, border: `1px solid ${T.line}` }}>
          Sem movimentos registados.
        </p>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.line}` }}>
          <div className="overflow-x-auto">
            <table className="dtable">
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Data</th>
                  <th>Vencimento</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                  <th style={{ textAlign: 'center' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {movimentos.map(m => (
                  <tr key={m.id}>
                    <td className="font-medium whitespace-nowrap">{m.documento}</td>
                    <td className="tnum whitespace-nowrap" style={{ color: T.sub }}>{m.data}</td>
                    <td className="tnum whitespace-nowrap" style={{ color: T.sub }}>{m.vencimento}</td>
                    <td className="tnum font-semibold whitespace-nowrap" style={{ textAlign: 'right', color: m.valor < 0 ? T.brand : T.forest }}>
                      {eur(m.valor)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Badge variant={MOV_TONE[m.estado]}>{MOV_LABEL[m.estado]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  )
}
