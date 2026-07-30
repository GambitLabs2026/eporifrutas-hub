// index · barrel do modelo de domínio + KPIs agregados (demo) · Eporifrutas Hub
// Ponto único de importação para as páginas: `import { ... } from '@/lib/mock'`

export * from './types'
export * from './artigos'
export * from './clientes'
export * from './encomendas'
export * from './conferencias'
export * from './analytics'
export * from './procedimentos'

import { ENCOMENDAS } from './encomendas'
import { CONFERENCIAS } from './conferencias'
import { MOVIMENTOS, ALERTAS_COBRANCA, CLIENTES } from './clientes'

// ─── KPIs para o dashboard ───────────────────────────────────────────────────

export function kpisEncomendas() {
  const porValidar = ENCOMENDAS.filter((e) => e.estado === 'extraida' || e.estado === 'em-validacao').length
  const comErro = ENCOMENDAS.filter((e) => e.estado === 'erro').length
  const novas = ENCOMENDAS.filter((e) => e.estado === 'nova').length
  const enviadasHoje = ENCOMENDAS.filter((e) => e.estado === 'enviada-phc').length
  const totalKgPorValidar = ENCOMENDAS.filter((e) => e.estado === 'extraida' || e.estado === 'em-validacao')
    .flatMap((e) => e.linhas)
    .reduce((s, l) => s + l.quantidadeKg, 0)
  return { porValidar, comErro, novas, enviadasHoje, totalKgPorValidar }
}

export function kpisConferencias() {
  const comDiscrepancia = CONFERENCIAS.filter((c) => c.estado === 'com-discrepancia').length
  const creditacaoPedida = CONFERENCIAS.filter((c) => c.estado === 'creditacao-pedida').length
  const valorACreditar = CONFERENCIAS.filter((c) => c.estado === 'com-discrepancia' || c.estado === 'creditacao-pedida').reduce((s, c) => s + c.valorACreditar, 0)
  return { comDiscrepancia, creditacaoPedida, valorACreditar, total: CONFERENCIAS.length }
}

export function kpisCobranca() {
  const totalVencido = ALERTAS_COBRANCA.reduce((s, a) => s + a.valorVencido, 0)
  const clientesEmDivida = ALERTAS_COBRANCA.length
  const saldoTotal = CLIENTES.reduce((s, c) => s + c.saldo, 0)
  const totalFaturasPendentes = MOVIMENTOS.filter((m) => m.estado === 'pendente' && m.tipo === 'fatura').reduce((s, m) => s + m.valor, 0)
  return { totalVencido, clientesEmDivida, saldoTotal, totalFaturasPendentes }
}

// Antiguidade de saldos (aging) a partir dos movimentos vencidos/pendentes
export function agingBuckets() {
  const buckets = { corrente: 0, d30: 0, d60: 0, d90: 0, mais90: 0 }
  for (const m of MOVIMENTOS) {
    if (m.tipo !== 'fatura' || m.estado === 'pago') continue
    if (m.estado === 'pendente') buckets.corrente += m.valor
    else if (m.diasAtraso <= 30) buckets.d30 += m.valor
    else if (m.diasAtraso <= 60) buckets.d60 += m.valor
    else if (m.diasAtraso <= 90) buckets.d90 += m.valor
    else buckets.mais90 += m.valor
  }
  return buckets
}
