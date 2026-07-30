'use client'
// payload-phc-modal · mostra o payload traduzido para a linguagem do PHC, pronto a enviar por API

import { useState } from 'react'
import { Send, CheckCircle2, Code2, ArrowRight } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { T, eur, kg } from '@/lib/ui/theme'
import { construirPayloadPhc } from '@/lib/ia/pipeline'
import { FORMATO_LABEL, type Encomenda } from '@/lib/mock'

export function PayloadPhcModal({ encomenda, onClose, onEnviar, jaEnviada }: {
  encomenda: Encomenda
  onClose: () => void
  onEnviar: () => void
  jaEnviada: boolean
}) {
  const p = construirPayloadPhc(encomenda)
  const [enviado, setEnviado] = useState(jaEnviada)
  const enviar = () => { setEnviado(true); onEnviar(); setTimeout(onClose, 950) }

  return (
    <Modal wide title="Enviar ao PHC via API" subtitle="Encomenda traduzida para a linguagem do PHC (artigos em código, quantidades em Kg)" onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Fechar</Button>
          <Button onClick={enviar} disabled={enviado}>
            {enviado ? <>Registada no PHC <CheckCircle2 size={15} /></> : <>Enviar ao PHC via API <Send size={14} /></>}
          </Button>
        </>
      }>
      {/* Cabeçalho do documento */}
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="text-[12.5px]">
          <p className="font-semibold text-[var(--ink)]">{p.cliente.nome} <span className="text-[var(--muted)] font-normal">· NIF {p.cliente.nif}</span></p>
          <p className="text-[var(--muted)]">{p.documento} · origem: {FORMATO_LABEL[encomenda.origem]}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="brand">{kg(p.totalKg, 2)}</Badge>
          <Badge variant="neutral">{eur(p.totalValor)}</Badge>
        </div>
      </div>

      {/* Tradução: texto do cliente → linguagem PHC */}
      <div className="rounded-lg overflow-hidden mb-3" style={{ border: `1px solid ${T.line}` }}>
        <div className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]" style={{ backgroundColor: T.surfaceAlt }}>
          <Code2 size={12} /> Correspondência para a linguagem da empresa
        </div>
        <table className="dtable">
          <thead>
            <tr><th>Texto do cliente</th><th></th><th>Código PHC</th><th>Designação</th><th style={{ textAlign: 'right' }}>Qtd (Kg)</th></tr>
          </thead>
          <tbody>
            {p.linhas.map((l, i) => (
              <tr key={i}>
                <td className="font-mono text-[12px] text-[var(--sub)]">{l.textoOrigem}</td>
                <td style={{ width: 20 }}><ArrowRight size={12} style={{ color: T.lineStrong }} /></td>
                <td className="font-mono font-semibold" style={{ color: T.brandDark }}>{l.codigoArtigo}</td>
                <td className="text-[var(--ink)]">{l.designacao}</td>
                <td className="tnum font-semibold" style={{ textAlign: 'right', color: T.forest }}>{kg(l.quantidade, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payload técnico (o que vai na API) */}
      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--muted)] mb-1.5">Payload API · POST /phc/encomendas</p>
      <pre className="rounded-lg p-3 text-[11px] font-mono overflow-x-auto leading-relaxed" style={{ backgroundColor: '#0E3B24', color: '#CFE6D5' }}>
{JSON.stringify(p, null, 2)}
      </pre>
    </Modal>
  )
}
