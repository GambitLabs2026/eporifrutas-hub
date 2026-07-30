'use client'
// modelo-email-modal · editor do modelo-tipo de email de cobrança (marcadores) · Eporifrutas Ops Hub

import { useState } from 'react'
import { Save, RotateCcw, Info } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { T } from '@/lib/ui/theme'
import { MARCADORES, MODELO_PADRAO, type ModeloEmail } from '@/lib/cobranca/engine'

export function ModeloEmailModal({ modelo, onClose, onGuardar }: {
  modelo: ModeloEmail
  onClose: () => void
  onGuardar: (m: ModeloEmail) => void
}) {
  const [assunto, setAssunto] = useState(modelo.assunto)
  const [corpo, setCorpo] = useState(modelo.corpo)
  const [guardado, setGuardado] = useState(false)

  const guardar = () => { onGuardar({ assunto, corpo }); setGuardado(true); setTimeout(onClose, 700) }
  const repor = () => { setAssunto(MODELO_PADRAO.assunto); setCorpo(MODELO_PADRAO.corpo) }

  return (
    <Modal wide title="Modelo de email de cobrança" subtitle="Editável — usado como base em todas as cobranças" onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={repor}><RotateCcw size={13} /> Repor padrão</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={guardar} disabled={guardado}>{guardado ? 'Guardado ✓' : <>Guardar modelo <Save size={14} /></>}</Button>
        </>
      }>
      <div className="flex items-start gap-2 mb-4 rounded-lg px-3 py-2.5" style={{ backgroundColor: T.skySoft }}>
        <Info size={14} className="mt-0.5 shrink-0" style={{ color: '#1F6B88' }} />
        <div className="text-[11.5px]" style={{ color: '#1F6B88' }}>
          <p className="font-semibold mb-1">Marcadores (substituídos automaticamente por cliente):</p>
          <div className="flex flex-wrap gap-1.5">
            {MARCADORES.map(m => (
              <span key={m.chave} title={m.descricao} className="font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#fff', border: `1px solid ${T.line}`, color: T.sub }}>{m.chave}</span>
            ))}
          </div>
        </div>
      </div>

      <label className="block text-[11px] font-bold tracking-wide text-[var(--muted)] mb-1.5">ASSUNTO</label>
      <input value={assunto} onChange={e => setAssunto(e.target.value)}
        className="w-full rounded-lg px-3 py-2 text-[13px] mb-3.5 ring-focus" style={{ border: `1px solid ${T.line}` }} />

      <label className="block text-[11px] font-bold tracking-wide text-[var(--muted)] mb-1.5">CORPO DA MENSAGEM</label>
      <textarea value={corpo} onChange={e => setCorpo(e.target.value)} rows={13}
        className="w-full rounded-lg px-3 py-2.5 text-[12.5px] font-mono leading-relaxed ring-focus resize-none" style={{ border: `1px solid ${T.line}`, backgroundColor: T.surfaceAlt }} />
    </Modal>
  )
}
