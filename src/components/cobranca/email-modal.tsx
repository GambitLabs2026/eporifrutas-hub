'use client'
// email-modal · compõe e "envia" o email de cobrança a partir do modelo automático · Eporifrutas Ops Hub

import { useState } from 'react'
import { Mail, Send, CheckCircle2, Clock } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { T, eur } from '@/lib/ui/theme'
import { construirEmail, type AlertaVivo } from '@/lib/cobranca/engine'
import { carregarModelo } from '@/lib/cobranca/store'
import { ACAO_COBRANCA_LABEL } from '@/lib/mock'

export function EmailCobrancaModal({ alerta, onClose, onEnviar }: {
  alerta: AlertaVivo
  onClose: () => void
  onEnviar: (clienteId: string) => void
}) {
  const modelo = construirEmail(alerta, carregarModelo())
  const [assunto, setAssunto] = useState(modelo.assunto)
  const [corpo, setCorpo] = useState(modelo.corpo)
  const [enviado, setEnviado] = useState(false)

  const enviar = () => {
    setEnviado(true)
    onEnviar(alerta.cliente.id)
    setTimeout(onClose, 950)
  }

  return (
    <Modal wide title="Enviar email de cobrança" subtitle={`Modelo automático · ${ACAO_COBRANCA_LABEL[alerta.acao]}`} onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={enviar} disabled={enviado}>
            {enviado ? <>Enviado <CheckCircle2 size={15} /></> : <>Enviar email <Send size={14} /></>}
          </Button>
        </>
      }>
      {/* Destinatário + contexto */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: T.brandSoft }}>
            <Mail size={16} style={{ color: T.brandDark }} />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[var(--ink)] truncate">{alerta.cliente.nome}</p>
            <p className="text-[11.5px] text-[var(--muted)] truncate font-mono">{alerta.cliente.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="danger" dot>{alerta.diasAtrasoMax} dias em atraso</Badge>
          <Badge variant="citrus">{eur(alerta.valorVencido)}</Badge>
        </div>
      </div>

      {/* Assunto */}
      <label className="block text-[11px] font-bold tracking-wide text-[var(--muted)] mb-1.5">ASSUNTO</label>
      <input value={assunto} onChange={e => setAssunto(e.target.value)}
        className="w-full rounded-lg px-3 py-2 text-[13px] mb-3.5 ring-focus" style={{ border: `1px solid ${T.line}` }} />

      {/* Corpo */}
      <label className="block text-[11px] font-bold tracking-wide text-[var(--muted)] mb-1.5">MENSAGEM</label>
      <textarea value={corpo} onChange={e => setCorpo(e.target.value)} rows={11}
        className="w-full rounded-lg px-3 py-2.5 text-[12.5px] font-mono leading-relaxed ring-focus resize-none" style={{ border: `1px solid ${T.line}`, backgroundColor: T.surfaceAlt }} />

      <p className="text-[11px] text-[var(--muted)] mt-2.5 flex items-center gap-1.5">
        <Clock size={12} /> Gerado automaticamente com base no cliente e no atraso. Pode editar antes de enviar.
      </p>
    </Modal>
  )
}
