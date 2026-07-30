// encomendas · encomendas recebidas de clientes (email/PDF/Excel) em vários estados (demo)
// Eporifrutas Hub — Módulo 1. Cada linha mostra o texto original do cliente e a conversão para Kg.

import { Encomenda } from './types'

export const ENCOMENDAS: Encomenda[] = [
  // 1 ── Email de restaurante · extração limpa, aguarda validação ────────────
  {
    id: 'enc-001',
    referencia: 'ENC-2607-001',
    clienteId: 'cli-011',
    clienteNome: 'Marisqueira do Cais',
    canal: 'horeca',
    origem: 'email',
    ficheiro: 'RE: Encomenda para amanhã',
    recebidaEm: '2026-07-30T07:42:00',
    estado: 'extraida',
    confiancaGlobal: 96,
    notas: 'Entregar antes das 8h. Fatura em nome da sociedade.',
    avisos: [],
    linhas: [
      { id: 'l1', textoOriginal: '10 cx maçã royal gala', artigoId: 'art-001', artigoNome: 'Maçã Royal Gala', quantidadeOriginal: 10, unidadeOriginal: 'caixa', quantidadeKg: 130, precoKg: 1.2, confianca: 98, estado: 'ok' },
      { id: 'l2', textoOriginal: '5 cx tomate chucha', artigoId: 'art-020', artigoNome: 'Tomate Chucha', quantidadeOriginal: 5, unidadeOriginal: 'caixa', quantidadeKg: 30, precoKg: 1.4, confianca: 97, estado: 'ok' },
      { id: 'l3', textoOriginal: '3 sacos batata', artigoId: 'art-021', artigoNome: 'Batata Agria', quantidadeOriginal: 3, unidadeOriginal: 'saco', quantidadeKg: 75, precoKg: 0.6, confianca: 95, estado: 'ok' },
      { id: 'l4', textoOriginal: '2 cx morango', artigoId: 'art-005', artigoNome: 'Morango', quantidadeOriginal: 2, unidadeOriginal: 'caixa', quantidadeKg: 4, precoKg: 4.5, confianca: 93, estado: 'ok' },
      { id: 'l5', textoOriginal: '20 un alface iceberg', artigoId: 'art-023', artigoNome: 'Alface Iceberg', quantidadeOriginal: 20, unidadeOriginal: 'unidade', quantidadeKg: 9, precoKg: 1.1, confianca: 90, estado: 'ok' },
    ],
  },

  // 2 ── PDF de hotel · 1 artigo não reconhecido ─────────────────────────────
  {
    id: 'enc-002',
    referencia: 'ENC-2607-002',
    clienteId: 'cli-010',
    clienteNome: 'Hotel Tivoli Avenida Lisboa',
    canal: 'horeca',
    origem: 'pdf',
    ficheiro: 'requisicao_economato_3007.pdf',
    recebidaEm: '2026-07-30T06:15:00',
    estado: 'em-validacao',
    confiancaGlobal: 84,
    notas: 'Requisição do economato — pavilhão de cozinha central.',
    avisos: ['1 artigo não reconhecido ("Physalis") — associar a artigo ou remover.'],
    linhas: [
      { id: 'l1', textoOriginal: 'Laranja do Algarve — 8 caixas', artigoId: 'art-004', artigoNome: 'Laranja do Algarve', quantidadeOriginal: 8, unidadeOriginal: 'caixa', quantidadeKg: 120, precoKg: 0.95, confianca: 96, estado: 'ok' },
      { id: 'l2', textoOriginal: 'Abacate Hass — 3 cx', artigoId: 'art-011', artigoNome: 'Abacate Hass', quantidadeOriginal: 3, unidadeOriginal: 'caixa', quantidadeKg: 12, precoKg: 4.8, confianca: 94, estado: 'ok' },
      { id: 'l3', textoOriginal: 'Manga — 2 cx', artigoId: 'art-010', artigoNome: 'Manga Kent', quantidadeOriginal: 2, unidadeOriginal: 'caixa', quantidadeKg: 12, precoKg: 3.2, confianca: 91, estado: 'ok' },
      { id: 'l4', textoOriginal: 'Physalis — 1 cx', artigoId: null, artigoNome: '?', quantidadeOriginal: 1, unidadeOriginal: 'caixa', quantidadeKg: 0, precoKg: 0, confianca: 34, estado: 'nao-reconhecido', sugestao: 'Sem correspondência no catálogo. Criar artigo ou associar manualmente.' },
      { id: 'l5', textoOriginal: 'Sumo laranja natural 1L — 12 grf', artigoId: 'art-040', artigoNome: 'Sumo Laranja Natural 1L', quantidadeOriginal: 12, unidadeOriginal: 'unidade', quantidadeKg: 12.36, precoKg: 2.8, confianca: 88, estado: 'ok' },
    ],
  },

  // 3 ── Excel de cadeia de restaurantes · linha com grafia diferente (aviso) ─
  {
    id: 'enc-003',
    referencia: 'ENC-2607-003',
    clienteId: 'cli-012',
    clienteNome: 'Grupo Multifood',
    canal: 'horeca',
    origem: 'excel',
    ficheiro: 'encomenda_semana31_multifood.xlsx',
    recebidaEm: '2026-07-29T18:30:00',
    estado: 'extraida',
    confiancaGlobal: 89,
    notas: 'Distribuir por 12 restaurantes — entrega no armazém central.',
    avisos: ['1 linha com correspondência aproximada ("bróculos" → Brócolos) — confirmar.'],
    linhas: [
      { id: 'l1', textoOriginal: 'Banana Madeira | 15 | caixa', artigoId: 'art-003', artigoNome: 'Banana da Madeira', quantidadeOriginal: 15, unidadeOriginal: 'caixa', quantidadeKg: 270, precoKg: 1.35, confianca: 97, estado: 'ok' },
      { id: 'l2', textoOriginal: 'Cebola | 8 | saco', artigoId: 'art-022', artigoNome: 'Cebola Nacional', quantidadeOriginal: 8, unidadeOriginal: 'saco', quantidadeKg: 160, precoKg: 0.55, confianca: 95, estado: 'ok' },
      { id: 'l3', textoOriginal: 'bróculos | 6 | cx', artigoId: 'art-027', artigoNome: 'Brócolos', quantidadeOriginal: 6, unidadeOriginal: 'caixa', quantidadeKg: 36, precoKg: 1.8, confianca: 76, estado: 'aviso', sugestao: 'Grafia diferente do catálogo — corresponde a "Brócolos".' },
      { id: 'l4', textoOriginal: 'Pepino | 10 | cx', artigoId: 'art-030', artigoNome: 'Pepino', quantidadeOriginal: 10, unidadeOriginal: 'caixa', quantidadeKg: 80, precoKg: 1.05, confianca: 94, estado: 'ok' },
      { id: 'l5', textoOriginal: 'Courgette | 6 | cx', artigoId: 'art-025', artigoNome: 'Courgette', quantidadeOriginal: 6, unidadeOriginal: 'caixa', quantidadeKg: 30, precoKg: 1.25, confianca: 93, estado: 'ok' },
      { id: 'l6', textoOriginal: 'Cenoura | 5 | saco', artigoId: 'art-024', artigoNome: 'Cenoura', quantidadeOriginal: 5, unidadeOriginal: 'saco', quantidadeKg: 50, precoKg: 0.7, confianca: 92, estado: 'ok' },
    ],
  },

  // 4 ── Email de grossista · pronta a enviar (aprovada) ─────────────────────
  {
    id: 'enc-004',
    referencia: 'ENC-2607-004',
    clienteId: 'cli-002',
    clienteNome: 'Frutaria Central de Coimbra',
    canal: 'grossista',
    origem: 'email',
    ficheiro: 'Encomenda 30/07',
    recebidaEm: '2026-07-30T05:50:00',
    estado: 'aprovada',
    confiancaGlobal: 98,
    avisos: [],
    validadaPor: 'Ricardo Martins',
    validadaEm: '2026-07-30T08:10:00',
    linhas: [
      { id: 'l1', textoOriginal: '2 paletes pera rocha', artigoId: 'art-002', artigoNome: 'Pera Rocha do Oeste', quantidadeOriginal: 2, unidadeOriginal: 'palete', quantidadeKg: 1440, precoKg: 1.1, confianca: 99, estado: 'ok' },
      { id: 'l2', textoOriginal: '30 cx laranja algarve', artigoId: 'art-004', artigoNome: 'Laranja do Algarve', quantidadeOriginal: 30, unidadeOriginal: 'caixa', quantidadeKg: 450, precoKg: 0.95, confianca: 98, estado: 'ok' },
      { id: 'l3', textoOriginal: '15 cx kiwi', artigoId: 'art-009', artigoNome: 'Kiwi Hayward', quantidadeOriginal: 15, unidadeOriginal: 'caixa', quantidadeKg: 120, precoKg: 2.1, confianca: 97, estado: 'ok' },
    ],
  },

  // 5 ── Excel de supermercado · já registada no PHC ─────────────────────────
  {
    id: 'enc-005',
    referencia: 'ENC-2606-198',
    clienteId: 'cli-031',
    clienteNome: 'Pingo Doce — DC Azambuja',
    canal: 'supermercado',
    origem: 'excel',
    ficheiro: 'PD_azambuja_encomenda_2906.xlsx',
    recebidaEm: '2026-07-29T14:05:00',
    estado: 'enviada-phc',
    confiancaGlobal: 99,
    avisos: [],
    validadaPor: 'Ricardo Martins',
    validadaEm: '2026-07-29T15:20:00',
    linhas: [
      { id: 'l1', textoOriginal: 'MAÇÃ ROYAL GALA;40;PALETE', artigoId: 'art-001', artigoNome: 'Maçã Royal Gala', quantidadeOriginal: 40, unidadeOriginal: 'palete', quantidadeKg: 31200, precoKg: 1.2, confianca: 99, estado: 'ok' },
      { id: 'l2', textoOriginal: 'UVA SEM GRAINHA;60;CAIXA', artigoId: 'art-008', artigoNome: 'Uva sem Grainha', quantidadeOriginal: 60, unidadeOriginal: 'caixa', quantidadeKg: 300, precoKg: 2.6, confianca: 99, estado: 'ok' },
      { id: 'l3', textoOriginal: 'PIMENTO VERMELHO;25;CAIXA', artigoId: 'art-026', artigoNome: 'Pimento Vermelho', quantidadeOriginal: 25, unidadeOriginal: 'caixa', quantidadeKg: 125, precoKg: 1.9, confianca: 98, estado: 'ok' },
      { id: 'l4', textoOriginal: 'BATATA AGRIA;30;PALETE', artigoId: 'art-021', artigoNome: 'Batata Agria', quantidadeOriginal: 30, unidadeOriginal: 'palete', quantidadeKg: 30000, precoKg: 0.6, confianca: 99, estado: 'ok' },
    ],
  },

  // 6 ── PDF digitalizado de navio · baixa qualidade (erro) ──────────────────
  {
    id: 'enc-006',
    referencia: 'ENC-2607-006',
    clienteId: 'cli-020',
    clienteNome: 'MSC Cruises — Ship Supply',
    canal: 'cruzeiro',
    origem: 'pdf',
    ficheiro: 'provision_order_MSC_scan.pdf',
    recebidaEm: '2026-07-30T04:30:00',
    estado: 'erro',
    confiancaGlobal: 46,
    notas: 'Provision order — vessel calls Lisbon 31/07 08:00. Delivery to pier.',
    avisos: ['Documento digitalizado com baixa qualidade.', '2 linhas por confirmar — quantidades pouco legíveis.'],
    linhas: [
      { id: 'l1', textoOriginal: 'Oranges — 20 boxes', artigoId: 'art-004', artigoNome: 'Laranja do Algarve', quantidadeOriginal: 20, unidadeOriginal: 'caixa', quantidadeKg: 300, precoKg: 0.95, confianca: 71, estado: 'aviso', sugestao: 'Idioma EN — confirmar correspondência "Oranges" → Laranja.' },
      { id: 'l2', textoOriginal: 'Bananas — 1? boxes', artigoId: 'art-003', artigoNome: 'Banana da Madeira', quantidadeOriginal: 10, unidadeOriginal: 'caixa', quantidadeKg: 180, precoKg: 1.35, confianca: 38, estado: 'aviso', sugestao: 'Quantidade ilegível ("1?") — confirmar com o cliente.' },
      { id: 'l3', textoOriginal: 'Fresh juice 1L — ?? units', artigoId: 'art-040', artigoNome: 'Sumo Laranja Natural 1L', quantidadeOriginal: 24, unidadeOriginal: 'unidade', quantidadeKg: 24.72, precoKg: 2.8, confianca: 29, estado: 'aviso', sugestao: 'Quantidade não reconhecida — assumido 24, confirmar.' },
    ],
  },

  // 7 ── Excel de supermercado regional · acabou de chegar (nova) ────────────
  {
    id: 'enc-007',
    referencia: 'ENC-2607-007',
    clienteId: 'cli-030',
    clienteNome: 'SuperFresco',
    canal: 'supermercado',
    origem: 'excel',
    ficheiro: 'superfresco_reposicao_sem31.xlsx',
    recebidaEm: '2026-07-30T08:22:00',
    estado: 'nova',
    confiancaGlobal: 0,
    avisos: [],
    linhas: [],
  },

  // 8 ── WhatsApp de catering · texto informal, a IA interpreta ──────────────
  {
    id: 'enc-008',
    referencia: 'ENC-2607-008',
    clienteId: 'cli-013',
    clienteNome: 'Catering Sabores & Companhia',
    canal: 'horeca',
    origem: 'whatsapp',
    ficheiro: 'WhatsApp · +351 91 •• •• 666',
    recebidaEm: '2026-07-30T07:05:00',
    estado: 'extraida',
    confiancaGlobal: 90,
    notas: 'Mensagem informal — “Bom dia! Para hoje preciso de…”. Entrega no evento às 11h.',
    avisos: [],
    linhas: [
      { id: 'l1', textoOriginal: '5 cx tomate', artigoId: 'art-020', artigoNome: 'Tomate Chucha', quantidadeOriginal: 5, unidadeOriginal: 'caixa', quantidadeKg: 30, precoKg: 1.4, confianca: 94, estado: 'ok' },
      { id: 'l2', textoOriginal: '10 kg cebola', artigoId: 'art-022', artigoNome: 'Cebola Nacional', quantidadeOriginal: 10, unidadeOriginal: 'kg', quantidadeKg: 10, precoKg: 0.55, confianca: 95, estado: 'ok' },
      { id: 'l3', textoOriginal: '3 cx alface', artigoId: 'art-023', artigoNome: 'Alface Iceberg', quantidadeOriginal: 3, unidadeOriginal: 'caixa', quantidadeKg: 16.2, precoKg: 1.1, confianca: 88, estado: 'ok' },
      { id: 'l4', textoOriginal: 'e uns limões (2 cx)', artigoId: 'art-013', artigoNome: 'Limão', quantidadeOriginal: 2, unidadeOriginal: 'caixa', quantidadeKg: 30, precoKg: 1.3, confianca: 83, estado: 'ok' },
    ],
  },

  // 9 ── Foto de encomenda manuscrita · OCR + interpretação ──────────────────
  {
    id: 'enc-009',
    referencia: 'ENC-2607-009',
    clienteId: 'cli-001',
    clienteNome: 'Mercado Abastecedor do Porto',
    canal: 'grossista',
    origem: 'imagem',
    ficheiro: 'foto_nota_manuscrita.jpg',
    recebidaEm: '2026-07-30T06:48:00',
    estado: 'em-validacao',
    confiancaGlobal: 74,
    notas: 'Nota manuscrita fotografada no balcão. OCR com caligrafia — confirmar linhas assinaladas.',
    avisos: ['1 linha com quantidade pouco legível na caligrafia.'],
    linhas: [
      { id: 'l1', textoOriginal: 'Maçã gala — 20 cx', artigoId: 'art-001', artigoNome: 'Maçã Royal Gala', quantidadeOriginal: 20, unidadeOriginal: 'caixa', quantidadeKg: 260, precoKg: 1.2, confianca: 86, estado: 'ok' },
      { id: 'l2', textoOriginal: 'Pêra rocha — 15 cx', artigoId: 'art-002', artigoNome: 'Pera Rocha do Oeste', quantidadeOriginal: 15, unidadeOriginal: 'caixa', quantidadeKg: 180, precoKg: 1.1, confianca: 84, estado: 'ok' },
      { id: 'l3', textoOriginal: 'Laranja — ?? cx', artigoId: 'art-004', artigoNome: 'Laranja do Algarve', quantidadeOriginal: 10, unidadeOriginal: 'caixa', quantidadeKg: 150, precoKg: 0.95, confianca: 41, estado: 'aviso', sugestao: 'Quantidade ilegível na caligrafia — assumido 10, confirmar.' },
    ],
  },
]

export const ENCOMENDA_POR_ID: Record<string, Encomenda> = Object.fromEntries(ENCOMENDAS.map((e) => [e.id, e]))
