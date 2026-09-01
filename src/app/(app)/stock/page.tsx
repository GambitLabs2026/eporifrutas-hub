'use client'
// stock · Stock Diário do Armazém — apuramento do stock mínimo (tudo ao peso, Kg) · Eporifrutas Ops Hub
// Interligado: as ENCOMENDAS de clientes reservam stock; a CONFERÊNCIA (recebido) dá entrada.

import { useMemo, useState } from 'react'
import { AlertTriangle, PackageX, ShoppingCart, Wallet, Search } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { StatCard, StatGrid } from '@/components/ui/stat'
import { T, eur0, kg, type Tone } from '@/lib/ui/theme'
import { apuramentoStock, kpisStock, CATEGORIA_LABEL, type CategoriaArtigo, type EstadoStock } from '@/lib/mock'

const CAT_TONE: Record<CategoriaArtigo, Tone> = {
  frutamania: 'success',
  'da-horta': 'warning',
  'shake-it-up': 'info',
}

const ESTADO_META: Record<EstadoStock, { tone: Tone; label: string }> = {
  ok: { tone: 'success', label: 'OK' },
  baixo: { tone: 'warning', label: 'Abaixo do mínimo' },
  rutura: { tone: 'danger', label: 'Rutura' },
}

// rutura e baixo primeiro, ok por último
const ORDEM_ESTADO: Record<EstadoStock, number> = { rutura: 0, baixo: 1, ok: 2 }

type FiltroEstado = 'todos' | 'baixo' | 'rutura'

export default function StockPage() {
  const [pesquisa, setPesquisa] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')
  const [filtroCat, setFiltroCat] = useState<CategoriaArtigo | 'todas'>('todas')

  const kpis = useMemo(() => kpisStock(), [])
  const linhas = useMemo(() => apuramentoStock(), [])

  const lista = useMemo(() => {
    const q = pesquisa.trim().toLowerCase()
    return linhas
      .filter(l =>
        (filtroEstado === 'todos' || l.estado === filtroEstado) &&
        (filtroCat === 'todas' || l.artigo.categoria === filtroCat) &&
        (q === '' || l.artigo.nome.toLowerCase().includes(q) || l.artigo.codigoPhc.toLowerCase().includes(q)),
      )
      .sort((a, b) => ORDEM_ESTADO[a.estado] - ORDEM_ESTADO[b.estado] || b.sugestaoCompraKg - a.sugestaoCompraKg)
  }, [linhas, pesquisa, filtroEstado, filtroCat])

  const filtrosEstado: { key: FiltroEstado; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'baixo', label: 'Abaixo do mínimo' },
    { key: 'rutura', label: 'Em rutura' },
  ]

  const filtrosCat: { key: CategoriaArtigo | 'todas'; label: string }[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'frutamania', label: CATEGORIA_LABEL.frutamania },
    { key: 'da-horta', label: CATEGORIA_LABEL['da-horta'] },
    { key: 'shake-it-up', label: CATEGORIA_LABEL['shake-it-up'] },
  ]

  return (
    <div>
      <PageHeader
        title="Stock Diário do Armazém"
        description="O stock mínimo é apurado ao peso (Kg) e interligado: as encomendas de clientes reservam stock e a receção de fornecedores dá entrada, para saber o que falta comprar hoje."
      />

      <StatGrid cols={4}>
        <StatCard icon={AlertTriangle} tone="warning" value={String(kpis.abaixoMinimo)} label="Artigos abaixo do mínimo" hint="disponível < mínimo diário" />
        <StatCard icon={PackageX} tone="danger" value={String(kpis.ruturas)} label="Em rutura" hint="sem stock em armazém" />
        <StatCard icon={ShoppingCart} tone="brand" value={kg(kpis.sugestaoTotalKg)} label="Sugestão de compra" hint="para repor os mínimos" />
        <StatCard icon={Wallet} tone="neutral" value={eur0(kpis.valorStock)} label="Valor de stock" hint="ao preço de referência/kg" />
      </StatGrid>

      {/* Pesquisa + filtros */}
      <div className="flex flex-col gap-3 mt-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={pesquisa}
              onChange={e => setPesquisa(e.target.value)}
              placeholder="Pesquisar artigo pelo nome ou código PHC…"
              className="w-full rounded-lg pl-9 pr-3 py-2 text-[13px] text-[var(--ink)] ring-focus"
              style={{ backgroundColor: T.surface, border: `1px solid ${T.line}` }}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {filtrosEstado.map(f => {
              const on = filtroEstado === f.key
              return (
                <button key={f.key} onClick={() => setFiltroEstado(f.key)} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  style={on ? { backgroundColor: T.forest, color: '#fff' } : { backgroundColor: T.surface, color: T.sub, border: `1px solid ${T.line}` }}>
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filtrosCat.map(f => {
            const on = filtroCat === f.key
            return (
              <button key={f.key} onClick={() => setFiltroCat(f.key)} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={on ? { backgroundColor: T.forest, color: '#fff' } : { backgroundColor: T.surface, color: T.sub, border: `1px solid ${T.line}` }}>
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="dtable">
            <thead>
              <tr>
                <th>Artigo</th>
                <th style={{ textAlign: 'right' }}>Stock atual</th>
                <th style={{ textAlign: 'right' }}>Entradas hoje</th>
                <th style={{ textAlign: 'right' }}>Reservado</th>
                <th style={{ textAlign: 'right' }}>Disponível</th>
                <th style={{ textAlign: 'right' }}>Mínimo</th>
                <th style={{ textAlign: 'center' }}>Estado</th>
                <th style={{ textAlign: 'right' }}>Sugestão compra</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(l => {
                const meta = ESTADO_META[l.estado]
                return (
                  <tr key={l.artigo.id}>
                    <td>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[var(--ink)]">{l.artigo.nome}</span>
                        <Badge variant={CAT_TONE[l.artigo.categoria]}>{CATEGORIA_LABEL[l.artigo.categoria]}</Badge>
                      </div>
                      <span className="font-mono text-[11px] text-[var(--muted)]">{l.artigo.codigoPhc}</span>
                    </td>
                    <td className="tnum text-[var(--ink)]" style={{ textAlign: 'right' }}>{kg(l.stockAtualKg)}</td>
                    <td className="tnum" style={{ textAlign: 'right', color: l.entradasHojeKg > 0 ? T.brandDark : T.muted }}>
                      {l.entradasHojeKg > 0 ? '+' + kg(l.entradasHojeKg) : '—'}
                    </td>
                    <td className="tnum" style={{ textAlign: 'right', color: l.reservadoKg > 0 ? T.citrus : T.muted }}>
                      {l.reservadoKg > 0 ? '−' + kg(l.reservadoKg) : '—'}
                    </td>
                    <td className="tnum font-semibold" style={{ textAlign: 'right', color: l.disponivelKg < l.stockMinimoKg ? T.tomato : T.forest }}>
                      {kg(l.disponivelKg)}
                    </td>
                    <td className="tnum text-[var(--sub)]" style={{ textAlign: 'right' }}>{kg(l.stockMinimoKg)}</td>
                    <td style={{ textAlign: 'center' }}><Badge variant={meta.tone} dot>{meta.label}</Badge></td>
                    <td className="tnum font-semibold" style={{ textAlign: 'right', color: l.sugestaoCompraKg > 0 ? T.brandDark : T.muted }}>
                      {l.sugestaoCompraKg > 0 ? kg(l.sugestaoCompraKg) : '—'}
                    </td>
                  </tr>
                )
              })}
              {lista.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-[13px] text-[var(--muted)]" style={{ padding: '40px 14px' }}>
                    Nenhum artigo corresponde aos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11.5px] text-[var(--muted)] mt-3">
        {lista.length} de {linhas.length} artigos · <span className="font-medium text-[var(--sub)]">Reservado</span> vem das encomendas de clientes pendentes;
        {' '}<span className="font-medium text-[var(--sub)]">Entradas</span> vêm da mercadoria recebida na Conferência.
      </p>
    </div>
  )
}
