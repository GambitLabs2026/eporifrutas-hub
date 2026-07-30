'use client'
// artigos · catálogo de produtos com os fatores de conversão para Kg (peça central do PHC) · Eporifrutas Hub
// Cada artigo regista-se SEMPRE em Kg no PHC — aqui vive o "muda a unidade, o Kg recalcula".

import { useMemo, useState } from 'react'
import { Boxes, Package, Sprout, Layers, Sparkles, Search, Scale, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { StatCard, StatGrid } from '@/components/ui/stat'
import { T, eur, num, kg, type Tone } from '@/lib/ui/theme'
import {
  ARTIGOS, converterParaKg, CATEGORIA_LABEL, UNIDADE_LABEL,
  type Artigo, type CategoriaArtigo, type Unidade,
} from '@/lib/mock'

const TODAS_UNIDADES: Unidade[] = ['kg', 'caixa', 'palete', 'unidade', 'saco', 'molho']

const CAT_TONE: Record<CategoriaArtigo, Tone> = {
  frutamania: 'success',
  'da-horta': 'warning',
  'shake-it-up': 'info',
}

// unidades para as quais o artigo tem fator definido (base do PHC)
function unidadesComFator(art: Artigo): Unidade[] {
  return TODAS_UNIDADES.filter(u => converterParaKg(art, 1, u) !== null)
}

export default function ArtigosPage() {
  const [pesquisa, setPesquisa] = useState('')
  const [filtro, setFiltro] = useState<CategoriaArtigo | 'todas'>('todas')

  // ── Conversor rápido (estado local) ──────────────────────────────────────
  const [convId, setConvId] = useState<string>(ARTIGOS[0].id)
  const [convQtd, setConvQtd] = useState<number>(10)
  const artConv = ARTIGOS.find(a => a.id === convId) ?? ARTIGOS[0]
  const convUnidades = useMemo(() => unidadesComFator(artConv), [artConv])
  const [convUnid, setConvUnid] = useState<Unidade>('caixa')
  // garante que a unidade escolhida existe para o artigo atual
  const unidAtiva: Unidade = convUnidades.includes(convUnid) ? convUnid : convUnidades[0]
  const convKg = converterParaKg(artConv, convQtd, unidAtiva)

  const kpis = useMemo(() => {
    const porCategoria = (c: CategoriaArtigo) => ARTIGOS.filter(a => a.categoria === c).length
    return {
      total: ARTIGOS.length,
      frutamania: porCategoria('frutamania'),
      daHorta: porCategoria('da-horta'),
      shakeItUp: porCategoria('shake-it-up'),
      exoticos: ARTIGOS.filter(a => a.exotico).length,
    }
  }, [])

  const lista = useMemo(() => {
    const q = pesquisa.trim().toLowerCase()
    return ARTIGOS.filter(a =>
      (filtro === 'todas' || a.categoria === filtro) &&
      (q === '' || a.nome.toLowerCase().includes(q)),
    )
  }, [pesquisa, filtro])

  const filtros: { key: CategoriaArtigo | 'todas'; label: string }[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'frutamania', label: CATEGORIA_LABEL.frutamania },
    { key: 'da-horta', label: CATEGORIA_LABEL['da-horta'] },
    { key: 'shake-it-up', label: CATEGORIA_LABEL['shake-it-up'] },
  ]

  return (
    <div>
      <PageHeader
        title="Artigos"
        description="Catálogo com fatores de conversão para Kg — a base do registo no PHC."
      />

      <StatGrid cols={5}>
        <StatCard icon={Boxes} tone="brand" value={String(kpis.total)} label="Total de artigos" hint="no catálogo" />
        <StatCard icon={Package} tone="success" value={String(kpis.frutamania)} label={CATEGORIA_LABEL.frutamania} hint="fruta" />
        <StatCard icon={Sprout} tone="warning" value={String(kpis.daHorta)} label={CATEGORIA_LABEL['da-horta']} hint="legumes & hortícolas" />
        <StatCard icon={Layers} tone="info" value={String(kpis.shakeItUp)} label={CATEGORIA_LABEL['shake-it-up']} hint="sumos & smoothies" />
        <StatCard icon={Sparkles} tone="citrus" value={String(kpis.exoticos)} label="Exóticos" hint="fora de época/importados" />
      </StatGrid>

      {/* Conversor rápido — widget em destaque */}
      <div className="card p-5 mt-4" style={{ backgroundColor: T.brandSofter }}>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: T.surface }}>
            <Scale size={18} style={{ color: T.brand }} />
          </span>
          <div>
            <h3 className="text-[14px] font-bold text-[var(--ink)] leading-tight">Conversor rápido para Kg</h3>
            <p className="text-[11.5px] text-[var(--muted)] mt-0.5">Muda a unidade — o Kg recalcula. É sempre assim que entra no PHC.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_0.8fr_1fr] gap-3">
          {/* Artigo */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Artigo</span>
            <select
              value={convId}
              onChange={e => setConvId(e.target.value)}
              className="mt-1 w-full rounded-lg px-3 py-2 text-[13px] text-[var(--ink)] ring-focus"
              style={{ backgroundColor: T.surface, border: `1px solid ${T.line}` }}
            >
              {ARTIGOS.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </label>

          {/* Quantidade */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Quantidade</span>
            <input
              type="number"
              min={0}
              value={convQtd}
              onChange={e => setConvQtd(Math.max(0, Number(e.target.value)))}
              className="mt-1 w-full rounded-lg px-3 py-2 text-[13px] text-right tnum text-[var(--ink)] ring-focus"
              style={{ backgroundColor: T.surface, border: `1px solid ${T.line}` }}
            />
          </label>

          {/* Unidade (só as que têm fator) */}
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Unidade</span>
            <select
              value={unidAtiva}
              onChange={e => setConvUnid(e.target.value as Unidade)}
              className="mt-1 w-full rounded-lg px-3 py-2 text-[13px] text-[var(--ink)] ring-focus"
              style={{ backgroundColor: T.surface, border: `1px solid ${T.line}` }}
            >
              {convUnidades.map(u => <option key={u} value={u}>{UNIDADE_LABEL[u]}</option>)}
            </select>
          </label>
        </div>

        {/* Resultado em Kg — grande */}
        <div className="mt-4 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: T.surface, border: `1px solid ${T.line}` }}>
          <div className="flex items-center gap-2 text-[12px] text-[var(--sub)]">
            <span className="tnum font-semibold">{num(convQtd, 2)} {UNIDADE_LABEL[unidAtiva]}</span>
            <ArrowRight size={14} style={{ color: T.muted }} />
            <span className="uppercase tracking-wide text-[11px] text-[var(--muted)] font-semibold">registo PHC</span>
          </div>
          <p className="text-[28px] font-bold tnum leading-none" style={{ color: T.forest }}>
            {convKg !== null ? kg(convKg, 2) : '—'}
          </p>
        </div>

        <p className="text-[11.5px] text-[var(--muted)] mt-3">
          Só aparecem as unidades em que <span className="font-semibold text-[var(--sub)]">{artConv.nome}</span> é comercializado ·
          referência <span className="font-semibold" style={{ color: T.forest }}>{eur(artConv.precoKg)}/kg</span>
          {convKg !== null && <> · valor estimado <span className="font-semibold" style={{ color: T.forest }}>{eur(convKg * artConv.precoKg)}</span></>}
        </p>
      </div>

      {/* Pesquisa + filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
            placeholder="Pesquisar artigo pelo nome…"
            className="w-full rounded-lg pl-9 pr-3 py-2 text-[13px] text-[var(--ink)] ring-focus"
            style={{ backgroundColor: T.surface, border: `1px solid ${T.line}` }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filtros.map(f => {
            const on = filtro === f.key
            return (
              <button key={f.key} onClick={() => setFiltro(f.key)} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
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
                <th>Código PHC</th>
                <th>Artigo</th>
                <th>Categoria</th>
                <th>Origem</th>
                <th style={{ textAlign: 'right' }}>€/kg</th>
                <th style={{ textAlign: 'right', color: T.brandDark }}>Kg/caixa</th>
                <th style={{ textAlign: 'right', color: T.brandDark }}>Kg/palete</th>
                <th style={{ textAlign: 'right', color: T.brandDark }}>Kg/unidade</th>
                <th>Habitual</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(a => (
                <tr key={a.id}>
                  <td className="font-mono text-[12px] text-[var(--muted)]">{a.codigoPhc}</td>
                  <td>
                    <span className="font-medium text-[var(--ink)]">{a.nome}</span>
                    {a.exotico && <Badge variant="citrus" className="ml-2 align-middle"><Sparkles size={10} /> Exótico</Badge>}
                  </td>
                  <td><Badge variant={CAT_TONE[a.categoria]}>{CATEGORIA_LABEL[a.categoria]}</Badge></td>
                  <td className="text-[var(--sub)]">{a.origem}</td>
                  <td className="tnum text-[var(--sub)]" style={{ textAlign: 'right' }}>{eur(a.precoKg)}</td>
                  <ConvCell v={a.kgPorCaixa} />
                  <ConvCell v={a.kgPorPalete} />
                  <ConvCell v={a.kgPorUnidade} />
                  <td className="text-[var(--sub)]">{UNIDADE_LABEL[a.unidadeHabitual]}</td>
                </tr>
              ))}
              {lista.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-[13px] text-[var(--muted)]" style={{ padding: '40px 14px' }}>
                    Nenhum artigo corresponde à pesquisa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11.5px] text-[var(--muted)] mt-3">
        {lista.length} de {ARTIGOS.length} artigos · os fatores de conversão são o que garante que tudo entra no PHC em Kg.
      </p>
    </div>
  )
}

// célula de conversão (mostra "—" a cor muted quando não há fator para essa unidade)
function ConvCell({ v }: { v: number | null }) {
  return (
    <td className="tnum" style={{ textAlign: 'right', color: v != null ? T.forest : T.muted }}>
      {v != null ? num(v, 2) : '—'}
    </td>
  )
}
