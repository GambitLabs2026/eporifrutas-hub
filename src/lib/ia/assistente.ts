// assistente · motor de resposta do assistente interno (RAG simplificado sobre os procedimentos) · Eporifrutas
// Demo: correspondência por palavras-chave. Em produção, seria uma IA sobre a base de conhecimento.

import { PROCEDIMENTOS, type Procedimento } from '@/lib/mock'

const STOP = new Set(['o', 'a', 'os', 'as', 'de', 'do', 'da', 'que', 'e', 'em', 'um', 'uma', 'para', 'por', 'com', 'como', 'qual', 'quais', 'no', 'na', 'se', 'é', 'ao', 'à', 'quando', 'onde', 'faço', 'fazer', 'devo', 'quero', 'preciso'])

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP.has(t))
}

function pontuar(pergunta: string, p: Procedimento): number {
  const q = tokens(pergunta)
  const alvo = tokens(p.titulo + ' ' + p.tags.join(' ') + ' ' + p.categoria)
  const alvoPassos = tokens(p.passos.join(' '))
  let score = 0
  for (const t of q) {
    if (alvo.includes(t)) score += 3
    else if (alvoPassos.includes(t)) score += 1
    else if (p.tags.some(tag => tag.includes(t))) score += 2
  }
  return score
}

export interface RespostaAssistente {
  texto: string
  fontes: Procedimento[]
}

export function responder(pergunta: string): RespostaAssistente {
  const ranking = PROCEDIMENTOS.map(p => ({ p, s: pontuar(pergunta, p) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s)

  if (ranking.length === 0) {
    return {
      texto: 'Não encontrei um procedimento específico para essa pergunta. Reformule com outras palavras, ou crie um novo procedimento na biblioteca para que fique registado para todos.',
      fontes: [],
    }
  }

  const principal = ranking[0].p
  const secundarias = ranking.slice(1, 3).filter(x => x.s >= ranking[0].s * 0.5).map(x => x.p)

  const passos = principal.passos.map((p, i) => `${i + 1}. ${p}`).join('\n')
  let texto = `Com base no procedimento “${principal.titulo}” (${principal.categoria}):\n\n${passos}`
  if (secundarias.length > 0) {
    texto += `\n\nPode também ser relevante: ${secundarias.map(s => `“${s.titulo}”`).join(', ')}.`
  }

  return { texto, fontes: [principal, ...secundarias] }
}

export const SUGESTOES = [
  'Como valido uma encomenda antes do PHC?',
  'O que fazer quando a IA não reconhece um artigo?',
  'Como peço uma creditação a um fornecedor?',
  'Como funciona a cobrança por dias de atraso?',
  'Como defino o prazo de pagamento de um cliente?',
]
