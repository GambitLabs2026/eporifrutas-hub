// phc-sync · documentos que o PHC disponibiliza para leitura automática (demo) · Eporifrutas Ops Hub
// A app lê a criação da FATURA e, mais tarde, o RECIBO — sabendo automaticamente que ficou liquidada.

export type TipoDocPhc = 'fatura' | 'recibo'

export interface DocPhc {
  id: string
  tipo: TipoDocPhc
  documento: string
  clienteId: string
  clienteNome: string
  valor: number
  data: string // ISO (data do documento no PHC)
  liquida?: string // recibo: nº da fatura que este recibo liquida
}

// Fila de documentos ainda por sincronizar (o que o PHC tem e a app vai ler no próximo sync).
export const DOCS_PHC: DocPhc[] = [
  // Recibos → liquidam faturas vencidas: os clientes regularizam-se automaticamente
  { id: 'phc-r1', tipo: 'recibo', documento: 'REC 2026/0951', clienteId: 'cli-020', clienteNome: 'MSC Cruises — Ship Supply', valor: 28400, data: '2026-07-30', liquida: 'FT 2026/1005' },
  { id: 'phc-r2', tipo: 'recibo', documento: 'REC 2026/0952', clienteId: 'cli-030', clienteNome: 'SuperFresco', valor: 19890, data: '2026-07-30', liquida: 'FT 2026/1201' },
  // Faturas novas criadas no PHC → lidas para a conta-corrente
  { id: 'phc-f1', tipo: 'fatura', documento: 'FT 2026/1450', clienteId: 'cli-011', clienteNome: 'Marisqueira do Cais', valor: 2340, data: '2026-07-30' },
  { id: 'phc-f2', tipo: 'fatura', documento: 'FT 2026/1451', clienteId: 'cli-010', clienteNome: 'Hotel Tivoli Avenida Lisboa', valor: 5180, data: '2026-07-30' },
]

/** Conjunto de faturas liquidadas pelos recibos já lidos (para o motor as excluir dos vencidos). */
export function faturasLiquidadas(idsLidos: string[]): Set<string> {
  return new Set(
    DOCS_PHC.filter(d => d.tipo === 'recibo' && idsLidos.includes(d.id) && d.liquida).map(d => d.liquida as string),
  )
}
