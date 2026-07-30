'use client'
// encomendas · Módulo 1 — receção inteligente (email/PDF/Excel) → validação → PHC (sempre em Kg)

import { useMemo, useState } from 'react'
import {
  Mail, FileText, FileSpreadsheet, Camera, MessageCircle, CheckCircle2, AlertTriangle, Send,
  Sparkles, ArrowRight, CircleDot, Clock, ShieldCheck, Lock,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard, StatGrid } from '@/components/ui/stat'
import { PipelineIA } from '@/components/encomendas/pipeline-ia'
import { PayloadPhcModal } from '@/components/encomendas/payload-phc-modal'
import { useAuth } from '@/contexts/auth-context'
import { podeFazer } from '@/lib/auth/demo-auth'
import { estadoEtapas } from '@/lib/ia/pipeline'
import { T, eur, kg, type Tone } from '@/lib/ui/theme'
import {
  ENCOMENDAS, ARTIGO_POR_ID, converterParaKg, UNIDADE_LABEL, FORMATO_LABEL,
  ESTADO_ENCOMENDA_LABEL, CANAL_LABEL,
  type Encomenda, type EncomendaLinha, type EstadoEncomenda, type Unidade, type FormatoEncomenda,
} from '@/lib/mock'

const ORIGEM_ICON: Record<FormatoEncomenda, React.ElementType> = {
  email: Mail, pdf: FileText, excel: FileSpreadsheet, imagem: Camera, whatsapp: MessageCircle,
}
const ESTADO_TONE: Record<EstadoEncomenda, Tone> = {
  nova: 'info', extraida: 'violet', 'em-validacao': 'warning', aprovada: 'success', 'enviada-phc': 'neutral', erro: 'danger',
}

export default function EncomendasPage() {
  const { user } = useAuth()
  const canValidar = user ? podeFazer(user.role, 'encomendas.validar') : false
  const [encomendas, setEncomendas] = useState<Encomenda[]>(() => JSON.parse(JSON.stringify(ENCOMENDAS)))
  const [selId, setSelId] = useState<string>(ENCOMENDAS[0].id)
  const [filtro, setFiltro] = useState<EstadoEncomenda | 'todas'>('todas')
  const [payloadOpen, setPayloadOpen] = useState(false)

  const sel = encomendas.find(e => e.id === selId) ?? encomendas[0]
  const lista = useMemo(() => encomendas.filter(e => filtro === 'todas' || e.estado === filtro), [encomendas, filtro])

  const kpis = useMemo(() => {
    const porValidar = encomendas.filter(e => e.estado === 'extraida' || e.estado === 'em-validacao').length
    const erro = encomendas.filter(e => e.estado === 'erro').length
    const enviadas = encomendas.filter(e => e.estado === 'enviada-phc').length
    const kgv = encomendas.filter(e => e.estado === 'extraida' || e.estado === 'em-validacao').flatMap(e => e.linhas).reduce((s, l) => s + l.quantidadeKg, 0)
    return { porValidar, erro, enviadas, kgv }
  }, [encomendas])

  const patchLinha = (linhaId: string, patch: Partial<EncomendaLinha>) => {
    setEncomendas(prev => prev.map(e => e.id !== sel.id ? e : {
      ...e,
      linhas: e.linhas.map(l => {
        if (l.id !== linhaId) return l
        const m = { ...l, ...patch }
        const art = m.artigoId ? ARTIGO_POR_ID[m.artigoId] : null
        if (art) { const c = converterParaKg(art, m.quantidadeOriginal, m.unidadeOriginal); m.quantidadeKg = c ?? m.quantidadeKg }
        return m
      }),
    }))
  }
  const aprovar = () => setEncomendas(prev => prev.map(e => e.id !== sel.id ? e : { ...e, estado: 'enviada-phc', validadaPor: 'Ricardo Martins', validadaEm: '2026-07-30T08:30:00' }))

  const totalKg = sel.linhas.reduce((s, l) => s + l.quantidadeKg, 0)
  const totalValor = sel.linhas.reduce((s, l) => s + l.quantidadeKg * l.precoKg, 0)
  const bloqueio = sel.linhas.some(l => l.estado === 'nao-reconhecido')
  const jaEnviada = sel.estado === 'enviada-phc'

  const filtros: { key: EstadoEncomenda | 'todas'; label: string }[] = [
    { key: 'todas', label: 'Todas' }, { key: 'nova', label: 'Novas' }, { key: 'extraida', label: 'Extraídas' },
    { key: 'em-validacao', label: 'Em validação' }, { key: 'aprovada', label: 'Aprovadas' }, { key: 'erro', label: 'Requer atenção' }, { key: 'enviada-phc', label: 'No PHC' },
  ]
  const OrigemIcon = ORIGEM_ICON[sel.origem]

  return (
    <div>
      <PageHeader title="Receção de Encomendas" description="Várias IAs leem a encomenda em qualquer formato (email, PDF, Excel, foto, WhatsApp), interpretam e traduzem para a linguagem do PHC — prontas a enviar por API." />

      <StatGrid cols={4}>
        <StatCard icon={CircleDot} tone="warning" value={String(kpis.porValidar)} label="Por validar" hint="aguardam revisão" />
        <StatCard icon={AlertTriangle} tone="danger" value={String(kpis.erro)} label="Requer atenção" hint="extração incerta" />
        <StatCard icon={Sparkles} tone="brand" value={kg(kpis.kgv, 0)} label="Kg por validar" hint="prontos a registar" />
        <StatCard icon={CheckCircle2} tone="success" value={String(kpis.enviadas)} label="Enviadas ao PHC" hint="hoje" />
      </StatGrid>

      {/* Filtros */}
      <div className="flex gap-1.5 flex-wrap mt-5 mb-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,400px)_1fr] gap-4">
        {/* Inbox */}
        <div className="space-y-2">
          {lista.map(e => {
            const Icon = ORIGEM_ICON[e.origem]
            const active = e.id === sel.id
            return (
              <button key={e.id} onClick={() => setSelId(e.id)} className="w-full text-left rounded-xl p-3 transition-all card"
                style={active ? { boxShadow: `0 0 0 2px ${T.brand}`, borderColor: 'transparent' } : {}}>
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: T.brandSoft }}>
                    <Icon size={16} style={{ color: T.brandDark }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{e.clienteNome}</p>
                      <Badge variant={ESTADO_TONE[e.estado]} dot>{ESTADO_ENCOMENDA_LABEL[e.estado]}</Badge>
                    </div>
                    <p className="text-[11.5px] text-[var(--muted)] truncate mt-0.5 font-mono">{e.ficheiro}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[var(--muted)]">
                      <span>{CANAL_LABEL[e.canal]}</span><span>·</span><span>{e.linhas.length} linhas</span>
                      {e.confiancaGlobal > 0 && <><span>·</span><span className="tnum">conf. {e.confiancaGlobal}%</span></>}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
          {lista.length === 0 && <p className="text-[13px] text-[var(--muted)] py-10 text-center card">Sem encomendas neste estado.</p>}
        </div>

        {/* Detalhe / validação */}
        <div className="card overflow-hidden flex flex-col">
          {/* Cabeçalho */}
          <div className="px-5 py-4 border-b" style={{ borderColor: T.line, background: 'linear-gradient(180deg,#FAFBFA,#fff)' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: T.brandSoft }}><OrigemIcon size={14} style={{ color: T.brandDark }} /></span>
                  <h2 className="text-[15px] font-bold text-[var(--ink)] truncate">{sel.clienteNome}</h2>
                  <Badge variant={ESTADO_TONE[sel.estado]} dot>{ESTADO_ENCOMENDA_LABEL[sel.estado]}</Badge>
                </div>
                <p className="text-[11.5px] text-[var(--muted)] mt-1.5">{sel.referencia} · {FORMATO_LABEL[sel.origem]} · <span className="font-mono">{sel.ficheiro}</span></p>
              </div>
              {sel.confiancaGlobal > 0 && (
                <div className="text-right shrink-0">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--muted)] font-semibold">Confiança</p>
                  <p className="text-[20px] font-bold tnum leading-none mt-1" style={{ color: sel.confiancaGlobal >= 85 ? T.brand : sel.confiancaGlobal >= 60 ? T.citrus : T.tomato }}>{sel.confiancaGlobal}%</p>
                </div>
              )}
            </div>
          </div>

          {/* Pipeline multi-IA */}
          <PipelineIA estados={estadoEtapas(sel)} />

          {/* Avisos + notas */}
          {sel.avisos.length > 0 && (
            <div className="px-5 py-2.5 border-b space-y-1" style={{ borderColor: T.line, backgroundColor: T.citrusSoft }}>
              {sel.avisos.map((a, i) => <div key={i} className="flex items-start gap-2 text-[12px]" style={{ color: '#9A5C06' }}><AlertTriangle size={13} className="mt-0.5 shrink-0" /><span>{a}</span></div>)}
            </div>
          )}
          {sel.notas && (
            <div className="px-5 py-2.5 border-b text-[12px] text-[var(--sub)]" style={{ borderColor: T.line, backgroundColor: T.surfaceAlt }}>
              <span className="font-semibold text-[var(--muted)]">Observações extraídas: </span>{sel.notas}
            </div>
          )}

          {/* Linhas */}
          {sel.linhas.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-6">
              <span className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: T.surfaceAlt }}><Clock size={22} className="text-[var(--muted)]" /></span>
              <p className="text-[13px] font-semibold text-[var(--sub)]">Encomenda ainda por processar</p>
              <p className="text-[12px] text-[var(--muted)] mt-1 max-w-xs">Na versão real, a extração automática corre assim que o ficheiro é recebido.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto">
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Texto do cliente</th><th>Artigo</th><th>Qtd · Unid.</th>
                    <th style={{ textAlign: 'right', color: T.brandDark }}>→ Kg (PHC)</th><th style={{ textAlign: 'center' }}>Conf.</th>
                  </tr>
                </thead>
                <tbody>
                  {sel.linhas.map(l => <LinhaRow key={l.id} l={l} editable={!jaEnviada} onPatch={patchLinha} />)}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: T.surfaceAlt }}>
                    <td colSpan={3} className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: T.muted, padding: '11px 14px' }}>Total a registar no PHC</td>
                    <td className="tnum font-bold" style={{ textAlign: 'right', color: T.forest, padding: '11px 14px' }}>{kg(totalKg, 2)}</td>
                    <td className="tnum text-[11px]" style={{ textAlign: 'right', color: T.muted, padding: '11px 14px' }}>{eur(totalValor)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Rodapé de ações */}
          <div className="px-5 py-3.5 border-t flex items-center justify-between gap-3" style={{ borderColor: T.line }}>
            <div className="text-[12px] text-[var(--sub)] flex items-center gap-1.5">
              {jaEnviada ? <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: T.brand }}><CheckCircle2 size={14} /> Registada no PHC por {sel.validadaPor}</span>
                : bloqueio ? <span className="inline-flex items-center gap-1.5" style={{ color: '#9A5C06' }}><AlertTriangle size={14} /> Resolver artigo não reconhecido antes de enviar</span>
                  : <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[var(--muted)]" /> Validação humana obrigatória (fase 1)</span>}
            </div>
            {canValidar
              ? <Button onClick={() => setPayloadOpen(true)} disabled={jaEnviada || bloqueio || sel.linhas.length === 0}>
                  {jaEnviada ? <>Enviada <CheckCircle2 size={15} /></> : <>Rever e enviar ao PHC <Send size={14} /></>}
                </Button>
              : <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]"><Lock size={12} /> sem permissão para validar</span>}
          </div>
        </div>
      </div>

      {payloadOpen && <PayloadPhcModal encomenda={sel} jaEnviada={jaEnviada} onClose={() => setPayloadOpen(false)} onEnviar={aprovar} />}
    </div>
  )
}

function LinhaRow({ l, editable, onPatch }: { l: EncomendaLinha; editable: boolean; onPatch: (id: string, p: Partial<EncomendaLinha>) => void }) {
  const naoRec = l.estado === 'nao-reconhecido'
  const art = l.artigoId ? ARTIGO_POR_ID[l.artigoId] : null
  const unidades: Unidade[] = art ? (['kg', 'caixa', 'palete', 'unidade', 'saco', 'molho'] as Unidade[]).filter(u => converterParaKg(art, 1, u) !== null) : ['kg']
  return (
    <tr>
      <td className="font-mono text-[12px] text-[var(--sub)]">{l.textoOriginal}</td>
      <td>
        {naoRec ? <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: T.tomato }}><AlertTriangle size={12} /> Não reconhecido</span>
          : <span className="inline-flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-[var(--ink)]">{l.artigoNome}</span>
              {art && <span className="font-mono text-[10px] px-1 py-0.5 rounded" style={{ backgroundColor: T.brandSoft, color: T.brandDark }}>{art.codigoPhc}</span>}
            </span>}
        {l.estado === 'aviso' && l.sugestao && <p className="text-[11px] mt-0.5" style={{ color: '#9A5C06' }}>{l.sugestao}</p>}
        {naoRec && l.sugestao && <p className="text-[11px] text-[var(--muted)] mt-0.5">{l.sugestao}</p>}
      </td>
      <td>
        {editable && !naoRec ? (
          <div className="flex items-center gap-1">
            <input type="number" value={l.quantidadeOriginal} min={0} onChange={e => onPatch(l.id, { quantidadeOriginal: Number(e.target.value) })}
              className="w-14 rounded-md px-1.5 py-1 text-[13px] text-right tnum ring-focus" style={{ border: `1px solid ${T.line}` }} />
            <select value={l.unidadeOriginal} onChange={e => onPatch(l.id, { unidadeOriginal: e.target.value as Unidade })}
              className="rounded-md px-1 py-1 text-[12px] ring-focus" style={{ border: `1px solid ${T.line}` }}>
              {unidades.map(u => <option key={u} value={u}>{UNIDADE_LABEL[u]}</option>)}
            </select>
          </div>
        ) : <span className="text-[var(--sub)] tnum">{l.quantidadeOriginal} {UNIDADE_LABEL[l.unidadeOriginal]}</span>}
      </td>
      <td className="tnum font-bold" style={{ textAlign: 'right', color: naoRec ? '#C7CFCA' : T.forest }}>
        {naoRec ? '—' : <span className="inline-flex items-center gap-1 justify-end">{l.unidadeOriginal !== 'kg' && <ArrowRight size={11} style={{ color: '#C7CFCA' }} />}{kg(l.quantidadeKg, 2)}</span>}
      </td>
      <td><ConfBar v={l.confianca} /></td>
    </tr>
  )
}

function ConfBar({ v }: { v: number }) {
  const cor = v >= 85 ? T.brand : v >= 60 ? T.citrus : T.tomato
  return (
    <div className="flex items-center gap-1.5 justify-center">
      <div className="w-10 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EBEFEC' }}><div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: cor }} /></div>
      <span className="text-[10px] tnum" style={{ color: cor }}>{v}%</span>
    </div>
  )
}
