// clientes · clientes por canal + conta-corrente + alertas de cobrança (demo) · Eporifrutas Hub
// Datas de referência ancoradas em 2026-07-30 (hoje na demo).

import { Cliente, Movimento, AlertaCobranca } from './types'

export const CLIENTES: Cliente[] = [
  // ── Grossistas ──────────────────────────────────────────────────────────
  { id: 'cli-001', nome: 'Mercado Abastecedor do Porto', canal: 'grossista', nif: '501112223', contactoNome: 'António Faria', email: 'compras@marporto.pt', telefone: '229 000 111', localidade: 'Maia', prazoPagamentoDias: 30, formatoHabitual: 'excel', saldo: 18450.0, ativo: true },
  { id: 'cli-002', nome: 'Frutaria Central de Coimbra', canal: 'grossista', nif: '502223334', contactoNome: 'Sónia Lopes', email: 'geral@frutariacentral.pt', telefone: '239 000 222', localidade: 'Coimbra', prazoPagamentoDias: 30, formatoHabitual: 'email', saldo: 6120.5, ativo: true },

  // ── HORECA ──────────────────────────────────────────────────────────────
  { id: 'cli-010', nome: 'Hotel Tivoli Avenida Lisboa', canal: 'horeca', nif: '503334445', contactoNome: 'Chef Bruno Alves', email: 'economato@tivolilisboa.pt', telefone: '213 000 333', localidade: 'Lisboa', prazoPagamentoDias: 60, formatoHabitual: 'pdf', saldo: 9280.0, ativo: true },
  { id: 'cli-011', nome: 'Marisqueira do Cais', canal: 'horeca', nif: '504445556', contactoNome: 'Fernanda Reis', email: 'marisqueiradocais@gmail.com', telefone: '212 000 444', localidade: 'Cascais', prazoPagamentoDias: 30, formatoHabitual: 'email', saldo: 3110.0, ativo: true },
  { id: 'cli-012', nome: 'Grupo Multifood (12 restaurantes)', canal: 'horeca', nif: '505556667', contactoNome: 'Pedro Nogueira', email: 'compras@multifood.pt', telefone: '211 000 555', localidade: 'Lisboa', prazoPagamentoDias: 60, formatoHabitual: 'excel', saldo: 24730.0, ativo: true },
  { id: 'cli-013', nome: 'Catering Sabores & Companhia', canal: 'horeca', nif: '506667778', contactoNome: 'Inês Cardoso', email: 'logistica@saborescatering.pt', telefone: '214 000 666', localidade: 'Sintra', prazoPagamentoDias: 45, formatoHabitual: 'pdf', saldo: 1890.0, ativo: true },

  // ── Navios / Cruzeiros ──────────────────────────────────────────────────
  { id: 'cli-020', nome: 'MSC Cruises — Ship Supply', canal: 'cruzeiro', nif: 'IT09876543210', contactoNome: 'Provisions Dept.', email: 'provisions.lisbon@msc-shipsupply.com', telefone: '+39 010 000 777', localidade: 'Lisboa (porto)', prazoPagamentoDias: 90, formatoHabitual: 'pdf', saldo: 41200.0, ativo: true },
  { id: 'cli-021', nome: 'Global Ship Services (agente naval)', canal: 'cruzeiro', nif: '507778889', contactoNome: 'Miguel Antunes', email: 'ops@globalshipservices.pt', telefone: '218 000 888', localidade: 'Leixões', prazoPagamentoDias: 90, formatoHabitual: 'excel', saldo: 15680.0, ativo: true },

  // ── Supermercados ────────────────────────────────────────────────────────
  { id: 'cli-030', nome: 'SuperFresco (cadeia regional, 8 lojas)', canal: 'supermercado', nif: '508889990', contactoNome: 'Central de Compras', email: 'compras@superfresco.pt', telefone: '256 000 999', localidade: 'Aveiro', prazoPagamentoDias: 60, formatoHabitual: 'excel', saldo: 33540.0, ativo: true },
  { id: 'cli-031', nome: 'Pingo Doce — DC Azambuja', canal: 'supermercado', nif: '500011122', contactoNome: 'Receção Frescos', email: 'frescos.azambuja@pingodoce.pt', telefone: '263 000 100', localidade: 'Azambuja', prazoPagamentoDias: 60, formatoHabitual: 'excel', saldo: 52180.0, ativo: true },
  { id: 'cli-032', nome: 'Frutaria Bio Mercearia', canal: 'supermercado', nif: '501122334', contactoNome: 'Rita Gomes', email: 'rita@biomercearia.pt', telefone: '253 000 200', localidade: 'Braga', prazoPagamentoDias: 30, formatoHabitual: 'email', saldo: 740.0, ativo: true },
]

export const CLIENTE_POR_ID: Record<string, Cliente> = Object.fromEntries(CLIENTES.map((c) => [c.id, c]))

// ─── Conta-corrente: movimentos ──────────────────────────────────────────────
export const MOVIMENTOS: Movimento[] = [
  // Pingo Doce — grande volume, alguns vencidos
  { id: 'mov-001', clienteId: 'cli-031', clienteNome: 'Pingo Doce — DC Azambuja', tipo: 'fatura', documento: 'FT 2026/1187', data: '2026-04-28', vencimento: '2026-06-27', valor: 21460.0, estado: 'vencido', diasAtraso: 33 },
  { id: 'mov-002', clienteId: 'cli-031', clienteNome: 'Pingo Doce — DC Azambuja', tipo: 'fatura', documento: 'FT 2026/1342', data: '2026-05-30', vencimento: '2026-07-29', valor: 30720.0, estado: 'pendente', diasAtraso: 1 },
  { id: 'mov-003', clienteId: 'cli-031', clienteNome: 'Pingo Doce — DC Azambuja', tipo: 'pagamento', documento: 'REC 2026/0904', data: '2026-06-10', vencimento: '2026-06-10', valor: -18900.0, estado: 'pago', diasAtraso: 0 },

  // SuperFresco
  { id: 'mov-010', clienteId: 'cli-030', clienteNome: 'SuperFresco', tipo: 'fatura', documento: 'FT 2026/1201', data: '2026-05-15', vencimento: '2026-07-14', valor: 19890.0, estado: 'vencido', diasAtraso: 16 },
  { id: 'mov-011', clienteId: 'cli-030', clienteNome: 'SuperFresco', tipo: 'fatura', documento: 'FT 2026/1390', data: '2026-06-20', vencimento: '2026-08-19', valor: 13650.0, estado: 'pendente', diasAtraso: 0 },

  // MSC Cruises — grande, prazo 90d
  { id: 'mov-020', clienteId: 'cli-020', clienteNome: 'MSC Cruises', tipo: 'fatura', documento: 'FT 2026/1005', data: '2026-04-02', vencimento: '2026-07-01', valor: 28400.0, estado: 'vencido', diasAtraso: 29 },
  { id: 'mov-021', clienteId: 'cli-020', clienteNome: 'MSC Cruises', tipo: 'fatura', documento: 'FT 2026/1288', data: '2026-05-25', vencimento: '2026-08-23', valor: 12800.0, estado: 'pendente', diasAtraso: 0 },

  // Grupo Multifood
  { id: 'mov-030', clienteId: 'cli-012', clienteNome: 'Grupo Multifood', tipo: 'fatura', documento: 'FT 2026/1150', data: '2026-05-10', vencimento: '2026-07-09', valor: 14730.0, estado: 'vencido', diasAtraso: 21 },
  { id: 'mov-031', clienteId: 'cli-012', clienteNome: 'Grupo Multifood', tipo: 'fatura', documento: 'FT 2026/1401', data: '2026-06-28', vencimento: '2026-08-27', valor: 10000.0, estado: 'pendente', diasAtraso: 0 },

  // Mercado Abastecedor Porto
  { id: 'mov-040', clienteId: 'cli-001', clienteNome: 'Mercado Abastecedor do Porto', tipo: 'fatura', documento: 'FT 2026/1360', data: '2026-06-25', vencimento: '2026-07-25', valor: 18450.0, estado: 'vencido', diasAtraso: 5 },

  // Global Ship Services
  { id: 'mov-050', clienteId: 'cli-021', clienteNome: 'Global Ship Services', tipo: 'fatura', documento: 'FT 2026/1099', data: '2026-04-15', vencimento: '2026-07-14', valor: 15680.0, estado: 'vencido', diasAtraso: 16 },

  // Hotel Tivoli
  { id: 'mov-060', clienteId: 'cli-010', clienteNome: 'Hotel Tivoli Avenida', tipo: 'fatura', documento: 'FT 2026/1377', data: '2026-06-18', vencimento: '2026-08-17', valor: 9280.0, estado: 'pendente', diasAtraso: 0 },

  // Marisqueira do Cais
  { id: 'mov-070', clienteId: 'cli-011', clienteNome: 'Marisqueira do Cais', tipo: 'fatura', documento: 'FT 2026/1410', data: '2026-07-05', vencimento: '2026-08-04', valor: 3110.0, estado: 'pendente', diasAtraso: 0 },

  // Frutaria Central Coimbra
  { id: 'mov-080', clienteId: 'cli-002', clienteNome: 'Frutaria Central de Coimbra', tipo: 'fatura', documento: 'FT 2026/1355', data: '2026-06-22', vencimento: '2026-07-22', valor: 6120.5, estado: 'vencido', diasAtraso: 8 },
]

// ─── Alertas de cobrança (derivados dos vencidos, com ação sugerida) ─────────
export const ALERTAS_COBRANCA: AlertaCobranca[] = [
  { id: 'alr-001', clienteId: 'cli-031', clienteNome: 'Pingo Doce — DC Azambuja', canal: 'supermercado', valorVencido: 21460.0, diasAtrasoMax: 33, numDocsVencidos: 1, acaoSugerida: 'contacto' },
  { id: 'alr-002', clienteId: 'cli-020', clienteNome: 'MSC Cruises', canal: 'cruzeiro', valorVencido: 28400.0, diasAtrasoMax: 29, numDocsVencidos: 1, acaoSugerida: 'contacto' },
  { id: 'alr-003', clienteId: 'cli-030', clienteNome: 'SuperFresco', canal: 'supermercado', valorVencido: 19890.0, diasAtrasoMax: 16, numDocsVencidos: 1, acaoSugerida: 'lembrete' },
  { id: 'alr-004', clienteId: 'cli-012', clienteNome: 'Grupo Multifood', canal: 'horeca', valorVencido: 14730.0, diasAtrasoMax: 21, numDocsVencidos: 1, acaoSugerida: 'contacto' },
  { id: 'alr-005', clienteId: 'cli-021', clienteNome: 'Global Ship Services', canal: 'cruzeiro', valorVencido: 15680.0, diasAtrasoMax: 16, numDocsVencidos: 1, acaoSugerida: 'lembrete' },
  { id: 'alr-006', clienteId: 'cli-002', clienteNome: 'Frutaria Central de Coimbra', canal: 'grossista', valorVencido: 6120.5, diasAtrasoMax: 8, numDocsVencidos: 1, acaoSugerida: 'lembrete' },
  { id: 'alr-007', clienteId: 'cli-001', clienteNome: 'Mercado Abastecedor do Porto', canal: 'grossista', valorVencido: 18450.0, diasAtrasoMax: 5, numDocsVencidos: 1, acaoSugerida: 'lembrete' },
]
