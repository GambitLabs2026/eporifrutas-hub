'use client'
// procedimentos · base de conhecimento partilhada + assistente interno (ChatGPT interno) · Eporifrutas Ops Hub

import { useMemo, useRef, useState } from 'react'
import {
  MessagesSquare, Send, Sparkles, BookOpen, Plus, Search, FileText, Tag, User, Clock,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal, Field, TextInput, SelectInput, TextArea } from '@/components/ui/modal'
import { useAuth } from '@/contexts/auth-context'
import { T } from '@/lib/ui/theme'
import { PROCEDIMENTOS, CATEGORIAS_PROC, type Procedimento, type CategoriaProc } from '@/lib/mock'
import { responder, SUGESTOES } from '@/lib/ia/assistente'

interface Msg { autor: 'user' | 'ia'; texto: string; fontes?: Procedimento[] }

export default function ProcedimentosPage() {
  const { user } = useAuth()
  const [procs, setProcs] = useState<Procedimento[]>(() => [...PROCEDIMENTOS])
  const [busca, setBusca] = useState('')
  const [cat, setCat] = useState<CategoriaProc | 'todas'>('todas')
  const [aberto, setAberto] = useState<Procedimento | null>(null)
  const [novoOpen, setNovoOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [pergunta, setPergunta] = useState('')
  const [aPensar, setAPensar] = useState(false)
  const fimRef = useRef<HTMLDivElement>(null)

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase()
    return procs.filter(p =>
      (cat === 'todas' || p.categoria === cat) &&
      (q === '' || p.titulo.toLowerCase().includes(q) || p.tags.some(t => t.includes(q))),
    )
  }, [procs, busca, cat])

  const enviar = (texto?: string) => {
    const q = (texto ?? pergunta).trim()
    if (!q) return
    setMsgs(m => [...m, { autor: 'user', texto: q }])
    setPergunta(''); setAPensar(true)
    setTimeout(() => {
      const r = responder(q)
      setMsgs(m => [...m, { autor: 'ia', texto: r.texto, fontes: r.fontes }])
      setAPensar(false)
      setTimeout(() => fimRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }, 650)
  }

  const criar = (p: Omit<Procedimento, 'id' | 'autor' | 'atualizado'>) => {
    const novo: Procedimento = { ...p, id: `proc-${Date.now()}`, autor: user?.name ?? 'Utilizador', atualizado: new Date().toISOString().slice(0, 10) }
    setProcs(prev => [novo, ...prev])
    setNovoOpen(false)
  }

  return (
    <div>
      <PageHeader title="Procedimentos & Assistente"
        description="Uma base de conhecimento que todos criam — e um assistente interno que responde a dúvidas com base nos procedimentos da Eporifrutas."
        action={<Button onClick={() => setNovoOpen(true)}><Plus size={15} /> Novo procedimento</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">
        {/* Assistente (chat) */}
        <div className="card overflow-hidden flex flex-col" style={{ minHeight: 520 }}>
          <div className="px-5 py-3.5 border-b flex items-center gap-2.5" style={{ borderColor: T.line, background: 'linear-gradient(180deg,#FAFBFA,#fff)' }}>
            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: T.brandSoft }}><Sparkles size={17} style={{ color: T.brandDark }} /></span>
            <div>
              <h3 className="text-[13.5px] font-bold text-[var(--ink)]">Assistente Eporifrutas</h3>
              <p className="text-[11.5px] text-[var(--muted)]">Pergunte — responde com base nos procedimentos internos</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {msgs.length === 0 && (
              <div className="text-center py-6">
                <MessagesSquare size={26} className="mx-auto mb-3" style={{ color: T.lineStrong }} />
                <p className="text-[13px] text-[var(--sub)] font-medium">Faça uma pergunta ao assistente</p>
                <p className="text-[12px] text-[var(--muted)] mt-1 mb-4">Ele procura nos procedimentos e responde com os passos e a fonte.</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {SUGESTOES.map((s, i) => (
                    <button key={i} onClick={() => enviar(s)} className="text-[12px] px-3 py-1.5 rounded-full transition-colors" style={{ border: `1px solid ${T.line}`, color: T.sub, backgroundColor: '#fff' }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {msgs.map((m, i) => m.autor === 'user' ? (
              <div key={i} className="flex justify-end">
                <div className="rounded-2xl rounded-br-sm px-3.5 py-2 text-[13px] text-white max-w-[80%]" style={{ backgroundColor: T.brand }}>{m.texto}</div>
              </div>
            ) : (
              <div key={i} className="flex gap-2.5">
                <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: T.brandSoft }}><Sparkles size={14} style={{ color: T.brandDark }} /></span>
                <div className="min-w-0 max-w-[85%]">
                  <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] text-[var(--ink)] whitespace-pre-line leading-relaxed" style={{ backgroundColor: T.surfaceAlt, border: `1px solid ${T.line}` }}>{m.texto}</div>
                  {m.fontes && m.fontes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 items-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">Fontes:</span>
                      {m.fontes.map(f => (
                        <button key={f.id} onClick={() => setAberto(f)} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md transition-colors" style={{ backgroundColor: '#fff', border: `1px solid ${T.line}`, color: T.brandDark }}>
                          <FileText size={11} /> {f.titulo}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {aPensar && (
              <div className="flex gap-2.5">
                <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: T.brandSoft }}><Sparkles size={14} style={{ color: T.brandDark }} /></span>
                <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] text-[var(--muted)]" style={{ backgroundColor: T.surfaceAlt, border: `1px solid ${T.line}` }}>a consultar os procedimentos…</div>
              </div>
            )}
            <div ref={fimRef} />
          </div>

          <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: T.line }}>
            <input value={pergunta} onChange={e => setPergunta(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviar()}
              placeholder="Escreva a sua dúvida…" className="flex-1 rounded-lg px-3.5 py-2.5 text-[13px] ring-focus" style={{ border: `1px solid ${T.line}` }} />
            <Button onClick={() => enviar()} disabled={!pergunta.trim()}><Send size={15} /></Button>
          </div>
        </div>

        {/* Biblioteca de procedimentos */}
        <div className="card overflow-hidden flex flex-col" style={{ minHeight: 520 }}>
          <div className="px-5 py-3.5 border-b flex items-center gap-2.5" style={{ borderColor: T.line }}>
            <span className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: T.brandSoft }}><BookOpen size={17} style={{ color: T.brandDark }} /></span>
            <div className="flex-1">
              <h3 className="text-[13.5px] font-bold text-[var(--ink)]">Biblioteca de Procedimentos</h3>
              <p className="text-[11.5px] text-[var(--muted)]">{procs.length} procedimentos · criados pela equipa</p>
            </div>
          </div>

          <div className="px-4 pt-3 pb-2 space-y-2.5 border-b" style={{ borderColor: T.line }}>
            <div className="flex items-center gap-2 rounded-lg px-3 h-9" style={{ backgroundColor: T.surfaceAlt, border: `1px solid ${T.line}` }}>
              <Search size={14} style={{ color: T.muted }} />
              <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Pesquisar procedimento…" className="flex-1 bg-transparent outline-none text-[13px]" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['todas', ...CATEGORIAS_PROC] as const).map(c => {
                const on = cat === c
                return <button key={c} onClick={() => setCat(c)} className="text-[11.5px] font-semibold px-2.5 py-1 rounded-lg transition-colors" style={on ? { backgroundColor: T.forest, color: '#fff' } : { backgroundColor: '#fff', color: T.sub, border: `1px solid ${T.line}` }}>{c === 'todas' ? 'Todas' : c}</button>
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: T.line }}>
            {filtrados.map(p => (
              <button key={p.id} onClick={() => setAberto(p)} className="w-full text-left px-5 py-3 hover:bg-[var(--surface-alt)] transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{p.titulo}</p>
                  <Badge variant="neutral">{p.categoria}</Badge>
                </div>
                <p className="text-[11px] text-[var(--muted)] mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1"><User size={11} /> {p.autor}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={11} /> {p.atualizado}</span>
                  <span className="inline-flex items-center gap-1"><FileText size={11} /> {p.passos.length} passos</span>
                </p>
              </button>
            ))}
            {filtrados.length === 0 && <p className="text-[13px] text-[var(--muted)] py-10 text-center">Sem procedimentos para este filtro.</p>}
          </div>
        </div>
      </div>

      {/* Ler procedimento */}
      {aberto && (
        <Modal wide title={aberto.titulo} subtitle={`${aberto.categoria} · ${aberto.autor} · atualizado ${aberto.atualizado}`} onClose={() => setAberto(null)}
          footer={<Button variant="secondary" onClick={() => setAberto(null)}>Fechar</Button>}>
          <ol className="space-y-2.5">
            {aberto.passos.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0" style={{ backgroundColor: T.brandSoft, color: T.brandDark }}>{i + 1}</span>
                <span className="text-[13.5px] text-[var(--ink)] leading-relaxed pt-0.5">{p}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t" style={{ borderColor: T.line }}>
            {aberto.tags.map(t => <span key={t} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md" style={{ backgroundColor: T.surfaceAlt, color: T.muted }}><Tag size={10} /> {t}</span>)}
          </div>
        </Modal>
      )}

      {novoOpen && <NovoProcedimentoModal onClose={() => setNovoOpen(false)} onCriar={criar} />}
    </div>
  )
}

function NovoProcedimentoModal({ onClose, onCriar }: { onClose: () => void; onCriar: (p: Omit<Procedimento, 'id' | 'autor' | 'atualizado'>) => void }) {
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState<CategoriaProc>('Geral')
  const [passosTxt, setPassosTxt] = useState('')
  const [tagsTxt, setTagsTxt] = useState('')

  const guardar = () => {
    const passos = passosTxt.split('\n').map(s => s.trim()).filter(Boolean)
    if (!titulo.trim() || passos.length === 0) return
    onCriar({ titulo: titulo.trim(), categoria, passos, tags: tagsTxt.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) })
  }

  return (
    <Modal wide title="Novo procedimento" subtitle="Fica disponível para toda a equipa e para o assistente" onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button onClick={guardar}><Plus size={14} /> Criar procedimento</Button></>}>
      <div className="space-y-3.5">
        <Field label="Título"><TextInput value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex.: Como registar uma devolução" /></Field>
        <Field label="Categoria"><SelectInput value={categoria} onChange={e => setCategoria(e.target.value as CategoriaProc)} options={CATEGORIAS_PROC.map(c => ({ value: c, label: c }))} /></Field>
        <Field label="Passos (um por linha)" hint="Cada linha vira um passo numerado."><TextArea rows={6} value={passosTxt} onChange={e => setPassosTxt(e.target.value)} placeholder={'Confirmar dados…\nRegistar no sistema…\nAvisar o responsável…'} /></Field>
        <Field label="Tags (separadas por vírgula)" hint="Ajudam o assistente a encontrar o procedimento."><TextInput value={tagsTxt} onChange={e => setTagsTxt(e.target.value)} placeholder="devolução, cliente, crédito" /></Field>
      </div>
    </Modal>
  )
}
