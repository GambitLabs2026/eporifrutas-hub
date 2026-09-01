// stock · stock diário do armazém + apuramento do mínimo (demo) · Eporifrutas Ops Hub
// Tudo ao peso (Kg). Interligado: as ENCOMENDAS reservam stock; a CONFERÊNCIA (recebido) dá entrada.

import { ARTIGOS, ARTIGO_POR_ID } from './artigos'
import type { Artigo } from './types'
import { ENCOMENDAS } from './encomendas'
import { CONFERENCIAS } from './conferencias'

export interface StockBase {
  artigoId: string
  stockAtualKg: number
  stockMinimoKg: number // mínimo diário
}

export const STOCK_BASE: StockBase[] = [
  { artigoId: 'art-001', stockAtualKg: 4200, stockMinimoKg: 1500 },
  { artigoId: 'art-002', stockAtualKg: 3100, stockMinimoKg: 1200 },
  { artigoId: 'art-003', stockAtualKg: 900, stockMinimoKg: 800 },
  { artigoId: 'art-004', stockAtualKg: 2600, stockMinimoKg: 1000 },
  { artigoId: 'art-005', stockAtualKg: 180, stockMinimoKg: 300 },
  { artigoId: 'art-006', stockAtualKg: 1400, stockMinimoKg: 500 },
  { artigoId: 'art-007', stockAtualKg: 2200, stockMinimoKg: 600 },
  { artigoId: 'art-008', stockAtualKg: 640, stockMinimoKg: 400 },
  { artigoId: 'art-009', stockAtualKg: 1100, stockMinimoKg: 400 },
  { artigoId: 'art-010', stockAtualKg: 260, stockMinimoKg: 250 },
  { artigoId: 'art-011', stockAtualKg: 90, stockMinimoKg: 200 },
  { artigoId: 'art-012', stockAtualKg: 380, stockMinimoKg: 200 },
  { artigoId: 'art-013', stockAtualKg: 950, stockMinimoKg: 400 },
  { artigoId: 'art-020', stockAtualKg: 1300, stockMinimoKg: 800 },
  { artigoId: 'art-021', stockAtualKg: 8600, stockMinimoKg: 3000 },
  { artigoId: 'art-022', stockAtualKg: 5400, stockMinimoKg: 2000 },
  { artigoId: 'art-023', stockAtualKg: 420, stockMinimoKg: 500 },
  { artigoId: 'art-024', stockAtualKg: 3100, stockMinimoKg: 1200 },
  { artigoId: 'art-025', stockAtualKg: 540, stockMinimoKg: 300 },
  { artigoId: 'art-026', stockAtualKg: 380, stockMinimoKg: 250 },
  { artigoId: 'art-027', stockAtualKg: 210, stockMinimoKg: 350 },
  { artigoId: 'art-028', stockAtualKg: 470, stockMinimoKg: 200 },
  { artigoId: 'art-029', stockAtualKg: 160, stockMinimoKg: 180 },
  { artigoId: 'art-030', stockAtualKg: 720, stockMinimoKg: 350 },
  { artigoId: 'art-031', stockAtualKg: 240, stockMinimoKg: 150 },
  { artigoId: 'art-040', stockAtualKg: 380, stockMinimoKg: 150 },
  { artigoId: 'art-041', stockAtualKg: 120, stockMinimoKg: 100 },
  { artigoId: 'art-042', stockAtualKg: 90, stockMinimoKg: 80 },
]

const STOCK_POR_ID: Record<string, StockBase> = Object.fromEntries(STOCK_BASE.map((s) => [s.artigoId, s]))

// Reservado: Kg de encomendas de clientes pendentes (ainda não enviadas ao PHC) → saídas previstas
const ESTADOS_RESERVA = new Set(['extraida', 'em-validacao', 'aprovada'])
export function reservadoKg(artigoId: string): number {
  return ENCOMENDAS.filter((e) => ESTADOS_RESERVA.has(e.estado))
    .flatMap((e) => e.linhas)
    .filter((l) => l.artigoId === artigoId)
    .reduce((s, l) => s + l.quantidadeKg, 0)
}

// Entradas: Kg recebidos de fornecedores hoje (da Conferência) → dão entrada em stock
export function entradasHojeKg(artigoId: string): number {
  return CONFERENCIAS.flatMap((c) => c.linhas).filter((l) => l.artigoId === artigoId).reduce((s, l) => s + l.qtdRecebidaKg, 0)
}

export type EstadoStock = 'ok' | 'baixo' | 'rutura'

export interface StockLinha {
  artigo: Artigo
  stockAtualKg: number
  stockMinimoKg: number
  entradasHojeKg: number
  reservadoKg: number
  disponivelKg: number // atual − reservado
  estado: EstadoStock
  sugestaoCompraKg: number
}

export function apuramentoStock(): StockLinha[] {
  return ARTIGOS.map((artigo) => {
    const base = STOCK_POR_ID[artigo.id] ?? { artigoId: artigo.id, stockAtualKg: 0, stockMinimoKg: 0 }
    const reservado = reservadoKg(artigo.id)
    const entradas = entradasHojeKg(artigo.id)
    const disponivel = base.stockAtualKg - reservado
    const estado: EstadoStock = base.stockAtualKg <= 0 ? 'rutura' : disponivel < base.stockMinimoKg ? 'baixo' : 'ok'
    const sugestao = estado === 'ok' ? 0 : Math.max(0, Math.round((base.stockMinimoKg + reservado - base.stockAtualKg) / 10) * 10)
    return {
      artigo, stockAtualKg: base.stockAtualKg, stockMinimoKg: base.stockMinimoKg,
      entradasHojeKg: entradas, reservadoKg: reservado, disponivelKg: disponivel, estado, sugestaoCompraKg: sugestao,
    }
  })
}

export function kpisStock() {
  const linhas = apuramentoStock()
  const abaixoMinimo = linhas.filter((l) => l.estado === 'baixo').length
  const ruturas = linhas.filter((l) => l.estado === 'rutura').length
  const totalKg = linhas.reduce((s, l) => s + l.stockAtualKg, 0)
  const valorStock = linhas.reduce((s, l) => s + l.stockAtualKg * (ARTIGO_POR_ID[l.artigo.id]?.precoKg ?? 0), 0)
  const sugestaoTotalKg = linhas.reduce((s, l) => s + l.sugestaoCompraKg, 0)
  return { abaixoMinimo, ruturas, totalKg, valorStock, sugestaoTotalKg }
}
