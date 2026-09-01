// vasilhame · gestão de vasilhame retornável (caixas, paletes, girbox) + recolhas por camião (demo)
// Eporifrutas Ops Hub. Tudo ao peso: cada SKU tem TARA em Kg (bruto − tara = peso líquido de fruta).

export type TipoVasilhame = 'caixa' | 'palete' | 'contentor' | 'grade'

export const TIPO_VASILHAME_LABEL: Record<TipoVasilhame, string> = {
  caixa: 'Caixa', palete: 'Palete', contentor: 'Contentor', grade: 'Grade',
}

export interface VasilhameSku {
  id: string
  codigo: string
  nome: string
  tipo: TipoVasilhame
  taraKg: number // peso da tara (entra no cálculo do peso líquido)
  valorDeposito: number // € de depósito por unidade
  retornavel: boolean
}

// ~20 SKUs de vasilhame usados na distribuição hortofrutícola
export const VASILHAME_SKUS: VasilhameSku[] = [
  { id: 'vas-001', codigo: 'VAS001', nome: 'Caixa IFCO 4310 (40×30×10)', tipo: 'caixa', taraKg: 1.0, valorDeposito: 4.5, retornavel: true },
  { id: 'vas-002', codigo: 'VAS002', nome: 'Caixa IFCO 4314 (40×30×14)', tipo: 'caixa', taraKg: 1.2, valorDeposito: 4.8, retornavel: true },
  { id: 'vas-003', codigo: 'VAS003', nome: 'Caixa IFCO 6410 (60×40×10)', tipo: 'caixa', taraKg: 1.5, valorDeposito: 5.5, retornavel: true },
  { id: 'vas-004', codigo: 'VAS004', nome: 'Caixa IFCO 6415 (60×40×15)', tipo: 'caixa', taraKg: 1.8, valorDeposito: 5.8, retornavel: true },
  { id: 'vas-005', codigo: 'VAS005', nome: 'Caixa IFCO 6423 (60×40×23)', tipo: 'caixa', taraKg: 2.1, valorDeposito: 6.2, retornavel: true },
  { id: 'vas-006', codigo: 'VAS006', nome: 'Caixa madeira 50×30', tipo: 'caixa', taraKg: 1.4, valorDeposito: 2.5, retornavel: true },
  { id: 'vas-007', codigo: 'VAS007', nome: 'Caixa madeira 60×40', tipo: 'caixa', taraKg: 2.0, valorDeposito: 3.0, retornavel: true },
  { id: 'vas-008', codigo: 'VAS008', nome: 'Grade plástica 30×20', tipo: 'grade', taraKg: 0.8, valorDeposito: 3.2, retornavel: true },
  { id: 'vas-009', codigo: 'VAS009', nome: 'Cuvete retornável 30×40', tipo: 'caixa', taraKg: 0.6, valorDeposito: 2.0, retornavel: true },
  { id: 'vas-010', codigo: 'VAS010', nome: 'Palete EUR/EPAL 80×120', tipo: 'palete', taraKg: 25, valorDeposito: 12.0, retornavel: true },
  { id: 'vas-011', codigo: 'VAS011', nome: 'Palete americana 100×120', tipo: 'palete', taraKg: 28, valorDeposito: 13.5, retornavel: true },
  { id: 'vas-012', codigo: 'VAS012', nome: 'Meia-palete 60×80', tipo: 'palete', taraKg: 10, valorDeposito: 8.0, retornavel: true },
  { id: 'vas-013', codigo: 'VAS013', nome: 'Girbox / caixa-palete 120×100', tipo: 'contentor', taraKg: 42, valorDeposito: 55.0, retornavel: true },
  { id: 'vas-014', codigo: 'VAS014', nome: 'Contentor isotérmico 600L', tipo: 'contentor', taraKg: 35, valorDeposito: 60.0, retornavel: true },
  { id: 'vas-015', codigo: 'VAS015', nome: 'Roll container', tipo: 'contentor', taraKg: 30, valorDeposito: 45.0, retornavel: true },
  { id: 'vas-016', codigo: 'VAS016', nome: 'Bin de campo 120×100', tipo: 'contentor', taraKg: 40, valorDeposito: 50.0, retornavel: true },
  { id: 'vas-017', codigo: 'VAS017', nome: 'Tampa de palete', tipo: 'palete', taraKg: 3, valorDeposito: 4.0, retornavel: true },
  { id: 'vas-018', codigo: 'VAS018', nome: 'Colarinho de palete', tipo: 'palete', taraKg: 6, valorDeposito: 7.5, retornavel: true },
  { id: 'vas-019', codigo: 'VAS019', nome: 'Caixa plástica 40×60 empilhável', tipo: 'caixa', taraKg: 1.6, valorDeposito: 5.0, retornavel: true },
  { id: 'vas-020', codigo: 'VAS020', nome: 'Big-bag reutilizável', tipo: 'grade', taraKg: 2.5, valorDeposito: 9.0, retornavel: true },
]

export const VASILHAME_SKU_POR_ID: Record<string, VasilhameSku> = Object.fromEntries(VASILHAME_SKUS.map((v) => [v.id, v]))

// ─── Saldo de vasilhame por cliente e SKU (entregue − devolvido = em posse) ──
export interface SaldoVasilhame {
  clienteId: string
  skuId: string
  entregue: number
  devolvido: number
}

export const SALDOS_VASILHAME: SaldoVasilhame[] = [
  // Mercado Abastecedor do Porto (grossista, muito volume)
  { clienteId: 'cli-001', skuId: 'vas-004', entregue: 640, devolvido: 590 },
  { clienteId: 'cli-001', skuId: 'vas-005', entregue: 420, devolvido: 380 },
  { clienteId: 'cli-001', skuId: 'vas-010', entregue: 85, devolvido: 71 },
  { clienteId: 'cli-001', skuId: 'vas-013', entregue: 14, devolvido: 9 },
  // Frutaria Central de Coimbra
  { clienteId: 'cli-002', skuId: 'vas-004', entregue: 210, devolvido: 198 },
  { clienteId: 'cli-002', skuId: 'vas-010', entregue: 26, devolvido: 24 },
  // Hotel Tivoli
  { clienteId: 'cli-010', skuId: 'vas-002', entregue: 90, devolvido: 76 },
  { clienteId: 'cli-010', skuId: 'vas-004', entregue: 60, devolvido: 55 },
  // Grupo Multifood
  { clienteId: 'cli-012', skuId: 'vas-004', entregue: 320, devolvido: 288 },
  { clienteId: 'cli-012', skuId: 'vas-012', entregue: 48, devolvido: 40 },
  // MSC Cruises
  { clienteId: 'cli-020', skuId: 'vas-005', entregue: 180, devolvido: 150 },
  { clienteId: 'cli-020', skuId: 'vas-014', entregue: 22, devolvido: 16 },
  // SuperFresco
  { clienteId: 'cli-030', skuId: 'vas-004', entregue: 900, devolvido: 861 },
  { clienteId: 'cli-030', skuId: 'vas-005', entregue: 540, devolvido: 512 },
  { clienteId: 'cli-030', skuId: 'vas-010', entregue: 120, devolvido: 104 },
  // Pingo Doce — DC Azambuja (maior)
  { clienteId: 'cli-031', skuId: 'vas-004', entregue: 1450, devolvido: 1388 },
  { clienteId: 'cli-031', skuId: 'vas-005', entregue: 980, devolvido: 921 },
  { clienteId: 'cli-031', skuId: 'vas-010', entregue: 240, devolvido: 214 },
  { clienteId: 'cli-031', skuId: 'vas-013', entregue: 30, devolvido: 22 },
  // Frutaria Bio
  { clienteId: 'cli-032', skuId: 'vas-002', entregue: 40, devolvido: 38 },
]

// ─── Recolhas por camião ─────────────────────────────────────────────────────
export type EstadoRecolha = 'em-curso' | 'registada' | 'nota-emitida' | 'concluida'

export const ESTADO_RECOLHA_LABEL: Record<EstadoRecolha, string> = {
  'em-curso': 'Em curso', registada: 'Registada', 'nota-emitida': 'Nota emitida', concluida: 'Concluída',
}

export interface RecolhaLinha {
  skuId: string
  quantidade: number
}

export interface Recolha {
  id: string
  referencia: string
  clienteId: string
  clienteNome: string
  localizacao: string // morada detetada
  coords: string // GPS
  motorista: string
  data: string // ISO
  estado: EstadoRecolha
  linhas: RecolhaLinha[]
  notaDevolucao?: string
  emailEnviadoEm?: string | null
}

export const RECOLHAS: Recolha[] = [
  // Em curso — o camião chegou, GPS identificou o cliente, aguarda registo (demo interativa)
  {
    id: 'rec-001', referencia: 'REC-2607-001', clienteId: 'cli-001', clienteNome: 'Mercado Abastecedor do Porto',
    localizacao: 'MARP, Av. 25 de Abril, Maia', coords: '41.2356, -8.6199', motorista: 'José Carvalho',
    data: '2026-07-30T09:10:00', estado: 'em-curso',
    linhas: [
      { skuId: 'vas-004', quantidade: 45 },
      { skuId: 'vas-005', quantidade: 30 },
      { skuId: 'vas-010', quantidade: 12 },
    ],
    emailEnviadoEm: null,
  },
  {
    id: 'rec-002', referencia: 'REC-2607-002', clienteId: 'cli-030', clienteNome: 'SuperFresco',
    localizacao: 'Entreposto SuperFresco, Aveiro', coords: '40.6405, -8.6538', motorista: 'Nuno Pires',
    data: '2026-07-30T07:40:00', estado: 'nota-emitida',
    linhas: [
      { skuId: 'vas-004', quantidade: 60 },
      { skuId: 'vas-005', quantidade: 24 },
    ],
    notaDevolucao: 'ND 2026/0451', emailEnviadoEm: '2026-07-30T07:52:00',
  },
  {
    id: 'rec-003', referencia: 'REC-2606-198', clienteId: 'cli-031', clienteNome: 'Pingo Doce — DC Azambuja',
    localizacao: 'DC Pingo Doce, Azambuja', coords: '39.0694, -8.8695', motorista: 'José Carvalho',
    data: '2026-07-29T15:20:00', estado: 'concluida',
    linhas: [
      { skuId: 'vas-004', quantidade: 120 },
      { skuId: 'vas-010', quantidade: 18 },
      { skuId: 'vas-013', quantidade: 6 },
    ],
    notaDevolucao: 'ND 2026/0448', emailEnviadoEm: '2026-07-29T15:35:00',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function saldoDe(clienteId: string, skuId: string): number {
  const s = SALDOS_VASILHAME.find((x) => x.clienteId === clienteId && x.skuId === skuId)
  return s ? s.entregue - s.devolvido : 0
}

export interface SaldoClienteLinha { sku: VasilhameSku; entregue: number; devolvido: number; saldo: number }

export function saldosDoCliente(clienteId: string): SaldoClienteLinha[] {
  return SALDOS_VASILHAME.filter((s) => s.clienteId === clienteId).map((s) => ({
    sku: VASILHAME_SKU_POR_ID[s.skuId], entregue: s.entregue, devolvido: s.devolvido, saldo: s.entregue - s.devolvido,
  }))
}

export function saldoTotalCliente(clienteId: string): number {
  return SALDOS_VASILHAME.filter((s) => s.clienteId === clienteId).reduce((t, s) => t + (s.entregue - s.devolvido), 0)
}

export function taraTotalRecolha(r: Recolha): number {
  return r.linhas.reduce((t, l) => t + (VASILHAME_SKU_POR_ID[l.skuId]?.taraKg ?? 0) * l.quantidade, 0)
}

export function kpisVasilhame() {
  const emCirculacao = SALDOS_VASILHAME.reduce((t, s) => t + (s.entregue - s.devolvido), 0)
  const valorCirculacao = SALDOS_VASILHAME.reduce((t, s) => t + (s.entregue - s.devolvido) * (VASILHAME_SKU_POR_ID[s.skuId]?.valorDeposito ?? 0), 0)
  const recolhasHoje = RECOLHAS.filter((r) => r.data.slice(0, 10) === '2026-07-30').length
  const pendentes = RECOLHAS.filter((r) => r.estado === 'em-curso' || r.estado === 'registada').length
  return { emCirculacao, valorCirculacao, recolhasHoje, pendentes, skus: VASILHAME_SKUS.length }
}
