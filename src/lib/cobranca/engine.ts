// engine · motor de cobrança — recalcula atrasos a partir do prazo por cliente e gera alertas + email
// Eporifrutas Ops Hub · Módulo 3. Fonte única usada pelo dashboard e pela conta-corrente.

import { CLIENTES, MOVIMENTOS, CLIENTE_POR_ID, type Cliente, type AcaoCobranca, type Canal } from '@/lib/mock'

// "Hoje" fixo na demo (coerente com as datas do mock). Em produção seria a data real do PHC.
export const HOJE = new Date('2026-07-30T00:00:00')

const MS_DIA = 86_400_000
function addDias(iso: string, dias: number): Date {
  const d = new Date(iso.slice(0, 10) + 'T00:00:00')
  d.setDate(d.getDate() + dias)
  return d
}
function diffDias(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / MS_DIA)
}
export function fmtData(d: Date): string {
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export interface DocVencido {
  documento: string
  emissao: string
  vencimento: Date
  valor: number
  diasAtraso: number
}

export interface AlertaVivo {
  cliente: Cliente
  canal: Canal
  valorVencido: number
  diasAtrasoMax: number
  docs: DocVencido[]
  acao: AcaoCobranca
  emailEnviadoEm?: string | null
}

// Ação sugerida conforme o atraso máximo
export function acaoPorAtraso(dias: number): AcaoCobranca {
  if (dias <= 15) return 'lembrete'
  if (dias <= 45) return 'contacto'
  if (dias <= 75) return 'suspender'
  return 'juridico'
}

// Faturas em aberto (não pagas nem liquidadas por recibo lido do PHC), vencimento = emissão + prazo
function faturasEmAberto(clienteId: string, prazoDias: number, liquidadas: Set<string>): DocVencido[] {
  return MOVIMENTOS.filter(m => m.clienteId === clienteId && m.tipo === 'fatura' && m.estado !== 'pago' && !liquidadas.has(m.documento))
    .map(m => {
      const vencimento = addDias(m.data, prazoDias)
      return { documento: m.documento, emissao: m.data, vencimento, valor: m.valor, diasAtraso: diffDias(HOJE, vencimento) }
    })
}

/** Alertas vivos: um por cliente com pelo menos uma fatura vencida (diasAtraso > 0). */
export function calcularAlertas(prazos: Record<string, number>, emails: Record<string, string> = {}, liquidadas: Set<string> = new Set()): AlertaVivo[] {
  const out: AlertaVivo[] = []
  for (const cli of CLIENTES) {
    const prazo = prazos[cli.id] ?? cli.prazoPagamentoDias
    const vencidos = faturasEmAberto(cli.id, prazo, liquidadas).filter(d => d.diasAtraso > 0).sort((a, b) => b.diasAtraso - a.diasAtraso)
    if (vencidos.length === 0) continue
    const valorVencido = vencidos.reduce((s, d) => s + d.valor, 0)
    const diasAtrasoMax = vencidos[0].diasAtraso
    out.push({ cliente: cli, canal: cli.canal, valorVencido, diasAtrasoMax, docs: vencidos, acao: acaoPorAtraso(diasAtrasoMax), emailEnviadoEm: emails[cli.id] ?? null })
  }
  return out.sort((a, b) => b.valorVencido - a.valorVencido)
}

/** Antiguidade de saldos recalculada com os prazos atuais. */
export function calcularAging(prazos: Record<string, number>, liquidadas: Set<string> = new Set()) {
  const b = { corrente: 0, d30: 0, d60: 0, d90: 0, mais90: 0 }
  for (const cli of CLIENTES) {
    const prazo = prazos[cli.id] ?? cli.prazoPagamentoDias
    for (const d of faturasEmAberto(cli.id, prazo, liquidadas)) {
      if (d.diasAtraso <= 0) b.corrente += d.valor
      else if (d.diasAtraso <= 30) b.d30 += d.valor
      else if (d.diasAtraso <= 60) b.d60 += d.valor
      else if (d.diasAtraso <= 90) b.d90 += d.valor
      else b.mais90 += d.valor
    }
  }
  return b
}

export function resumoCobranca(prazos: Record<string, number>, emails: Record<string, string> = {}, liquidadas: Set<string> = new Set()) {
  const alertas = calcularAlertas(prazos, emails, liquidadas)
  return {
    alertas,
    totalVencido: alertas.reduce((s, a) => s + a.valorVencido, 0),
    numClientes: alertas.length,
    porEnviar: alertas.filter(a => !a.emailEnviadoEm).length,
  }
}

// ─── Modelo de email editável (com marcadores preenchidos por cliente/atraso) ──
const eur = (n: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n)

export interface ModeloEmail { assunto: string; corpo: string }

// Marcadores disponíveis para o modelo-tipo (mostrados no editor)
export const MARCADORES: { chave: string; descricao: string }[] = [
  { chave: '{cliente}', descricao: 'Nome do cliente' },
  { chave: '{contacto}', descricao: 'Nome do contacto' },
  { chave: '{documentos}', descricao: 'Lista de documentos vencidos' },
  { chave: '{valor_total}', descricao: 'Valor total em atraso' },
  { chave: '{dias_atraso}', descricao: 'Atraso máximo (dias)' },
  { chave: '{num_docs}', descricao: 'Nº de documentos' },
]

export const MODELO_PADRAO: ModeloEmail = {
  assunto: 'Eporifrutas · Pagamento em atraso — {num_docs} doc. ({valor_total})',
  corpo: `Exmo(s). Sr(s). {contacto},

Vimos por este meio recordar que se encontra(m) em atraso o(s) seguinte(s) documento(s):

{documentos}

Valor total em atraso: {valor_total}
Atraso máximo: {dias_atraso} dias

Agradecemos a regularização com a maior brevidade. Caso o pagamento já tenha sido efetuado, por favor ignore esta mensagem.

Com os melhores cumprimentos,
Departamento Financeiro
Eporifrutas, S.A.
financeiro@eporifrutas.pt`,
}

function preencher(tpl: string, a: AlertaVivo): string {
  const listaDocs = a.docs
    .map(d => `  • ${d.documento} — venc. ${fmtData(d.vencimento)} — ${eur(d.valor)} — ${d.diasAtraso} dias em atraso`)
    .join('\n')
  return tpl
    .split('{cliente}').join(a.cliente.nome)
    .split('{contacto}').join(a.cliente.contactoNome || a.cliente.nome)
    .split('{documentos}').join(listaDocs)
    .split('{valor_total}').join(eur(a.valorVencido))
    .split('{dias_atraso}').join(String(a.diasAtrasoMax))
    .split('{num_docs}').join(String(a.docs.length))
}

/** Compõe o email preenchendo o modelo-tipo (editável) com os dados do cliente e do atraso. */
export function construirEmail(a: AlertaVivo, modelo: ModeloEmail = MODELO_PADRAO): ModeloEmail {
  return { assunto: preencher(modelo.assunto, a), corpo: preencher(modelo.corpo, a) }
}

export function prazosPorDefeito(): Record<string, number> {
  return Object.fromEntries(CLIENTES.map(c => [c.id, c.prazoPagamentoDias]))
}

// Vencimento e atraso de uma fatura recalculados com o prazo atual do cliente
export function vencimentoDe(emissaoIso: string, prazoDias: number): Date {
  return addDias(emissaoIso, prazoDias)
}
export function atrasoDe(vencimento: Date): number {
  return diffDias(HOJE, vencimento)
}

export { CLIENTE_POR_ID }
