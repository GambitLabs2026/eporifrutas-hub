// pipeline · orquestração de várias IAs para extrair encomendas de qualquer formato → linguagem PHC
// Eporifrutas Ops Hub · Módulo 1. Cada etapa é um motor especializado, ligado por API.

import { type Encomenda, ARTIGO_POR_ID, CLIENTE_POR_ID } from '@/lib/mock'

export type EstadoEtapa = 'ok' | 'aviso' | 'erro' | 'pendente'

export interface EtapaIA {
  chave: string
  nome: string
  motor: string // a "IA" responsável
  descricao: string
}

// As várias IAs do pipeline (por ordem de execução)
export const PIPELINE_IA: EtapaIA[] = [
  { chave: 'leitura', nome: 'Leitura & OCR', motor: 'Vision OCR', descricao: 'Lê o documento em qualquer formato — email, PDF, Excel, foto ou WhatsApp.' },
  { chave: 'interpretacao', nome: 'Interpretação', motor: 'LLM extrator', descricao: 'Compreende cada linha: quantidade, unidade e produto pedido.' },
  { chave: 'correspondencia', nome: 'Correspondência', motor: 'Matcher semântico', descricao: 'Traduz o texto do cliente para o artigo e código do PHC da Eporifrutas.' },
  { chave: 'normalizacao', nome: 'Normalização', motor: 'Regras Eporifrutas', descricao: 'Converte todas as quantidades para Kg — a unidade do PHC.' },
  { chave: 'validacao', nome: 'Validação', motor: 'Verificador', descricao: 'Pontua a confiança e assinala o que precisa de revisão humana.' },
]

/** Estado de cada etapa do pipeline para uma encomenda concreta. */
export function estadoEtapas(enc: Encomenda): Record<string, EstadoEtapa> {
  if (enc.estado === 'nova') {
    return Object.fromEntries(PIPELINE_IA.map(e => [e.chave, 'pendente' as EstadoEtapa]))
  }
  const temNaoReconhecido = enc.linhas.some(l => l.estado === 'nao-reconhecido')
  const temAviso = enc.linhas.some(l => l.estado === 'aviso') || enc.avisos.length > 0
  const baixaQualidade = enc.estado === 'erro'

  return {
    leitura: baixaQualidade ? 'aviso' : 'ok',
    interpretacao: baixaQualidade ? 'aviso' : 'ok',
    correspondencia: temNaoReconhecido ? 'erro' : temAviso ? 'aviso' : 'ok',
    normalizacao: temNaoReconhecido ? 'aviso' : 'ok',
    validacao: baixaQualidade || temNaoReconhecido ? 'erro' : temAviso ? 'aviso' : 'ok',
  }
}

// ─── Payload para o ERP PHC (o que seria enviado pela API) ────────────────────
export interface LinhaPhc {
  codigoArtigo: string
  designacao: string
  quantidade: number // sempre em Kg
  unidade: 'KG'
  precoUnitario: number
  textoOrigem: string
}
export interface PayloadPhc {
  documento: string
  cliente: { nome: string; nif: string }
  data: string
  origem: string
  linhas: LinhaPhc[]
  totalKg: number
  totalValor: number
}

/** Constrói o payload no formato do PHC a partir da encomenda validada. */
export function construirPayloadPhc(enc: Encomenda): PayloadPhc {
  const cli = CLIENTE_POR_ID[enc.clienteId]
  const linhas: LinhaPhc[] = enc.linhas
    .filter(l => l.artigoId)
    .map(l => {
      const art = l.artigoId ? ARTIGO_POR_ID[l.artigoId] : undefined
      return {
        codigoArtigo: art?.codigoPhc ?? '—',
        designacao: l.artigoNome,
        quantidade: Number(l.quantidadeKg.toFixed(2)),
        unidade: 'KG' as const,
        precoUnitario: l.precoKg,
        textoOrigem: l.textoOriginal,
      }
    })
  return {
    documento: enc.referencia,
    cliente: { nome: cli?.nome ?? enc.clienteNome, nif: cli?.nif ?? '—' },
    data: enc.recebidaEm,
    origem: enc.origem,
    linhas,
    totalKg: Number(linhas.reduce((s, l) => s + l.quantidade, 0).toFixed(2)),
    totalValor: Number(linhas.reduce((s, l) => s + l.quantidade * l.precoUnitario, 0).toFixed(2)),
  }
}
