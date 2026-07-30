// artigos · catálogo de produtos hortofrutícolas + fornecedores (demo) · Eporifrutas Hub
// Cada artigo traz fatores de conversão para Kg (peso médio) — base do registo PHC.

import { Artigo, Fornecedor } from './types'

export const ARTIGOS: Artigo[] = [
  // ── Frutamania ──────────────────────────────────────────────────────────
  { id: 'art-001', codigoPhc: 'FR001', nome: 'Maçã Royal Gala', categoria: 'frutamania', origem: 'Alcobaça, PT', epoca: 'todo o ano', precoKg: 1.2, kgPorCaixa: 13, kgPorPalete: 780, kgPorUnidade: 0.18, unidadeHabitual: 'caixa' },
  { id: 'art-002', codigoPhc: 'FR002', nome: 'Pera Rocha do Oeste', categoria: 'frutamania', origem: 'Oeste, PT', epoca: 'ago–abr', precoKg: 1.1, kgPorCaixa: 12, kgPorPalete: 720, kgPorUnidade: 0.16, unidadeHabitual: 'caixa' },
  { id: 'art-003', codigoPhc: 'FR003', nome: 'Banana da Madeira', categoria: 'frutamania', origem: 'Madeira, PT', epoca: 'todo o ano', precoKg: 1.35, kgPorCaixa: 18, kgPorPalete: 900, kgPorUnidade: 0.15, unidadeHabitual: 'caixa' },
  { id: 'art-004', codigoPhc: 'FR004', nome: 'Laranja do Algarve', categoria: 'frutamania', origem: 'Algarve, PT', epoca: 'nov–mai', precoKg: 0.95, kgPorCaixa: 15, kgPorPalete: 900, kgPorUnidade: 0.22, unidadeHabitual: 'caixa' },
  { id: 'art-005', codigoPhc: 'FR005', nome: 'Morango', categoria: 'frutamania', origem: 'Odemira, PT', epoca: 'fev–jun', precoKg: 4.5, kgPorCaixa: 2, kgPorPalete: 240, kgPorUnidade: 0.5, unidadeHabitual: 'caixa' },
  { id: 'art-006', codigoPhc: 'FR006', nome: 'Meloa Cantalupo', categoria: 'frutamania', origem: 'Ribatejo, PT', epoca: 'jun–set', precoKg: 1.5, kgPorCaixa: 10, kgPorPalete: 600, kgPorUnidade: 1.2, unidadeHabitual: 'caixa' },
  { id: 'art-007', codigoPhc: 'FR007', nome: 'Melancia', categoria: 'frutamania', origem: 'Alentejo, PT', epoca: 'jun–set', precoKg: 0.7, kgPorCaixa: null, kgPorPalete: 720, kgPorUnidade: 6, unidadeHabitual: 'unidade' },
  { id: 'art-008', codigoPhc: 'FR008', nome: 'Uva sem Grainha', categoria: 'frutamania', origem: 'Espanha', epoca: 'jul–out', precoKg: 2.6, kgPorCaixa: 5, kgPorPalete: 400, kgPorUnidade: null, unidadeHabitual: 'caixa' },
  { id: 'art-009', codigoPhc: 'FR009', nome: 'Kiwi Hayward', categoria: 'frutamania', origem: 'Beira Litoral, PT', epoca: 'nov–mai', precoKg: 2.1, kgPorCaixa: 8, kgPorPalete: 640, kgPorUnidade: 0.1, unidadeHabitual: 'caixa' },
  { id: 'art-010', codigoPhc: 'FR010', nome: 'Manga Kent', categoria: 'frutamania', origem: 'Brasil', epoca: 'todo o ano', precoKg: 3.2, kgPorCaixa: 6, kgPorPalete: 360, kgPorUnidade: 0.4, unidadeHabitual: 'caixa', exotico: true },
  { id: 'art-011', codigoPhc: 'FR011', nome: 'Abacate Hass', categoria: 'frutamania', origem: 'Peru', epoca: 'todo o ano', precoKg: 4.8, kgPorCaixa: 4, kgPorPalete: 320, kgPorUnidade: 0.2, unidadeHabitual: 'caixa', exotico: true },
  { id: 'art-012', codigoPhc: 'FR012', nome: 'Ananás dos Açores', categoria: 'frutamania', origem: 'Açores, PT', epoca: 'todo o ano', precoKg: 2.9, kgPorCaixa: 9, kgPorPalete: 540, kgPorUnidade: 1.5, unidadeHabitual: 'unidade', exotico: true },
  { id: 'art-013', codigoPhc: 'FR013', nome: 'Limão', categoria: 'frutamania', origem: 'Espanha', epoca: 'todo o ano', precoKg: 1.3, kgPorCaixa: 15, kgPorPalete: 900, kgPorUnidade: 0.12, unidadeHabitual: 'caixa' },

  // ── Da Horta ────────────────────────────────────────────────────────────
  { id: 'art-020', codigoPhc: 'HT001', nome: 'Tomate Chucha', categoria: 'da-horta', origem: 'Ribatejo, PT', epoca: 'todo o ano', precoKg: 1.4, kgPorCaixa: 6, kgPorPalete: 480, kgPorUnidade: null, unidadeHabitual: 'caixa' },
  { id: 'art-021', codigoPhc: 'HT002', nome: 'Batata Agria', categoria: 'da-horta', origem: 'Beira Alta, PT', epoca: 'todo o ano', precoKg: 0.6, kgPorCaixa: 10, kgPorPalete: 1000, kgPorUnidade: null, kgPorSaco: 25, unidadeHabitual: 'saco' },
  { id: 'art-022', codigoPhc: 'HT003', nome: 'Cebola Nacional', categoria: 'da-horta', origem: 'Oeste, PT', epoca: 'todo o ano', precoKg: 0.55, kgPorCaixa: 10, kgPorPalete: 800, kgPorUnidade: null, kgPorSaco: 20, unidadeHabitual: 'saco' },
  { id: 'art-023', codigoPhc: 'HT004', nome: 'Alface Iceberg', categoria: 'da-horta', origem: 'Oeste, PT', epoca: 'todo o ano', precoKg: 1.1, kgPorCaixa: 5.4, kgPorPalete: 324, kgPorUnidade: 0.45, unidadeHabitual: 'unidade' },
  { id: 'art-024', codigoPhc: 'HT005', nome: 'Cenoura', categoria: 'da-horta', origem: 'Oeste, PT', epoca: 'todo o ano', precoKg: 0.7, kgPorCaixa: 10, kgPorPalete: 800, kgPorUnidade: null, kgPorSaco: 10, unidadeHabitual: 'saco' },
  { id: 'art-025', codigoPhc: 'HT006', nome: 'Courgette', categoria: 'da-horta', origem: 'Almería, ES', epoca: 'todo o ano', precoKg: 1.25, kgPorCaixa: 5, kgPorPalete: 400, kgPorUnidade: null, unidadeHabitual: 'caixa' },
  { id: 'art-026', codigoPhc: 'HT007', nome: 'Pimento Vermelho', categoria: 'da-horta', origem: 'Almería, ES', epoca: 'todo o ano', precoKg: 1.9, kgPorCaixa: 5, kgPorPalete: 400, kgPorUnidade: null, unidadeHabitual: 'caixa' },
  { id: 'art-027', codigoPhc: 'HT008', nome: 'Brócolos', categoria: 'da-horta', origem: 'Oeste, PT', epoca: 'set–mai', precoKg: 1.8, kgPorCaixa: 6, kgPorPalete: 480, kgPorUnidade: 0.4, unidadeHabitual: 'caixa' },
  { id: 'art-028', codigoPhc: 'HT009', nome: 'Alho Francês', categoria: 'da-horta', origem: 'Ribatejo, PT', epoca: 'todo o ano', precoKg: 1.6, kgPorCaixa: 10, kgPorPalete: 600, kgPorUnidade: null, kgPorMolho: 1, unidadeHabitual: 'caixa' },
  { id: 'art-029', codigoPhc: 'HT010', nome: 'Espinafres', categoria: 'da-horta', origem: 'Oeste, PT', epoca: 'out–abr', precoKg: 2.2, kgPorCaixa: 4, kgPorPalete: 320, kgPorUnidade: null, kgPorSaco: 2, unidadeHabitual: 'caixa' },
  { id: 'art-030', codigoPhc: 'HT011', nome: 'Pepino', categoria: 'da-horta', origem: 'Almería, ES', epoca: 'todo o ano', precoKg: 1.05, kgPorCaixa: 8, kgPorPalete: 640, kgPorUnidade: 0.4, unidadeHabitual: 'caixa' },
  { id: 'art-031', codigoPhc: 'HT012', nome: 'Cogumelo Branco', categoria: 'da-horta', origem: 'Santarém, PT', epoca: 'todo o ano', precoKg: 3.4, kgPorCaixa: 3, kgPorPalete: 240, kgPorUnidade: null, unidadeHabitual: 'caixa' },

  // ── Shake it up (sumos & smoothies) ─────────────────────────────────────
  { id: 'art-040', codigoPhc: 'SK001', nome: 'Sumo Laranja Natural 1L', categoria: 'shake-it-up', origem: 'Produção própria', epoca: 'todo o ano', precoKg: 2.8, kgPorCaixa: 6.2, kgPorPalete: 372, kgPorUnidade: 1.03, unidadeHabitual: 'caixa' },
  { id: 'art-041', codigoPhc: 'SK002', nome: 'Sumo Verde Detox 250ml', categoria: 'shake-it-up', origem: 'Produção própria', epoca: 'todo o ano', precoKg: 4.2, kgPorCaixa: 3.1, kgPorPalete: 248, kgPorUnidade: 0.26, unidadeHabitual: 'caixa' },
  { id: 'art-042', codigoPhc: 'SK003', nome: 'Smoothie Manga-Maracujá 250ml', categoria: 'shake-it-up', origem: 'Produção própria', epoca: 'todo o ano', precoKg: 4.6, kgPorCaixa: 3.1, kgPorPalete: 248, kgPorUnidade: 0.26, unidadeHabitual: 'caixa' },
]

export const FORNECEDORES: Fornecedor[] = [
  { id: 'for-001', nome: 'Frutas do Oeste, Lda.', nif: '502334455', pais: 'Portugal', categorias: ['frutamania', 'da-horta'], contacto: 'Rui Marques', email: 'compras@frutasoeste.pt' },
  { id: 'for-002', nome: 'Cooperativa Agrícola de Alcobaça', nif: '500998877', pais: 'Portugal', categorias: ['frutamania'], contacto: 'Helena Dias', email: 'geral@coopalcobaca.pt' },
  { id: 'for-003', nome: 'Hortícolas do Ribatejo', nif: '503221144', pais: 'Portugal', categorias: ['da-horta'], contacto: 'Nuno Silva', email: 'encomendas@hortiribatejo.pt' },
  { id: 'for-004', nome: 'Frutas Tropicales Almería S.L.', nif: 'ESB04567890', pais: 'Espanha', categorias: ['frutamania', 'da-horta'], contacto: 'Carlos Ortega', email: 'export@tropicalesalmeria.es' },
  { id: 'for-005', nome: 'Global Exotic Fruits BV', nif: 'NL8123456B01', pais: 'Holanda', categorias: ['frutamania'], contacto: 'Jan Bakker', email: 'sales@globalexotic.nl' },
  { id: 'for-006', nome: 'Banana da Madeira — GESBA', nif: '511223344', pais: 'Portugal', categorias: ['frutamania'], contacto: 'Marta Freitas', email: 'comercial@gesba.pt' },
]

// Índice rápido por id
export const ARTIGO_POR_ID: Record<string, Artigo> = Object.fromEntries(ARTIGOS.map((a) => [a.id, a]))
export const FORNECEDOR_POR_ID: Record<string, Fornecedor> = Object.fromEntries(FORNECEDORES.map((f) => [f.id, f]))
