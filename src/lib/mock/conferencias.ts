// conferencias · Receção vs. Faturação de fornecedores + creditações (demo) · Eporifrutas Hub
// Módulo 2. A Eporifrutas pesa tudo em Kg à entrada e compara com o faturado.

import { Conferencia } from './types'

export const CONFERENCIAS: Conferencia[] = [
  // 1 ── Discrepância (falta de entrega) · creditação a pedir ────────────────
  {
    id: 'cnf-001',
    fornecedorId: 'for-001',
    fornecedorNome: 'Frutas do Oeste, Lda.',
    documentoFatura: 'FT FDO 2026/842',
    dataRececao: '2026-07-30T05:30:00',
    estado: 'com-discrepancia',
    totalFaturado: 1626.0,
    totalRecebidoValor: 1599.6,
    valorACreditar: 26.4,
    linhas: [
      { id: 'l1', artigoId: 'art-001', artigoNome: 'Maçã Royal Gala', qtdFaturadaKg: 780, qtdRecebidaKg: 765, diferencaKg: -15, precoKg: 1.2, diferencaValor: -18.0, estado: 'falha' },
      { id: 'l2', artigoId: 'art-002', artigoNome: 'Pera Rocha do Oeste', qtdFaturadaKg: 360, qtdRecebidaKg: 360, diferencaKg: 0, precoKg: 1.1, diferencaValor: 0, estado: 'conforme' },
      { id: 'l3', artigoId: 'art-020', artigoNome: 'Tomate Chucha', qtdFaturadaKg: 60, qtdRecebidaKg: 54, diferencaKg: -6, precoKg: 1.4, diferencaValor: -8.4, estado: 'falha' },
    ],
  },

  // 2 ── Tudo conforme ───────────────────────────────────────────────────────
  {
    id: 'cnf-002',
    fornecedorId: 'for-002',
    fornecedorNome: 'Cooperativa Agrícola de Alcobaça',
    documentoFatura: 'FT COOP 2026/311',
    dataRececao: '2026-07-29T06:10:00',
    estado: 'conforme',
    totalFaturado: 936.0,
    totalRecebidoValor: 936.0,
    valorACreditar: 0,
    linhas: [
      { id: 'l1', artigoId: 'art-001', artigoNome: 'Maçã Royal Gala', qtdFaturadaKg: 520, qtdRecebidaKg: 520, diferencaKg: 0, precoKg: 1.2, diferencaValor: 0, estado: 'conforme' },
      { id: 'l2', artigoId: 'art-002', artigoNome: 'Pera Rocha do Oeste', qtdFaturadaKg: 288, qtdRecebidaKg: 288, diferencaKg: 0, precoKg: 1.1, diferencaValor: 0, estado: 'conforme' },
    ],
  },

  // 3 ── Creditação já pedida ────────────────────────────────────────────────
  {
    id: 'cnf-003',
    fornecedorId: 'for-004',
    fornecedorNome: 'Frutas Tropicales Almería S.L.',
    documentoFatura: 'FRA TA-2026-1904',
    dataRececao: '2026-07-28T04:50:00',
    estado: 'creditacao-pedida',
    totalFaturado: 1260.0,
    totalRecebidoValor: 1187.5,
    valorACreditar: 72.5,
    linhas: [
      { id: 'l1', artigoId: 'art-025', artigoNome: 'Courgette', qtdFaturadaKg: 400, qtdRecebidaKg: 380, diferencaKg: -20, precoKg: 1.25, diferencaValor: -25.0, estado: 'falha' },
      { id: 'l2', artigoId: 'art-026', artigoNome: 'Pimento Vermelho', qtdFaturadaKg: 400, qtdRecebidaKg: 375, diferencaKg: -25, precoKg: 1.9, diferencaValor: -47.5, estado: 'falha' },
    ],
  },

  // 4 ── Discrepância mista (falta + excesso) ────────────────────────────────
  {
    id: 'cnf-004',
    fornecedorId: 'for-003',
    fornecedorNome: 'Hortícolas do Ribatejo',
    documentoFatura: 'FT HR 2026/588',
    dataRececao: '2026-07-30T06:40:00',
    estado: 'com-discrepancia',
    totalFaturado: 1160.0,
    totalRecebidoValor: 1155.0,
    valorACreditar: 12.0,
    linhas: [
      { id: 'l1', artigoId: 'art-021', artigoNome: 'Batata Agria', qtdFaturadaKg: 1000, qtdRecebidaKg: 980, diferencaKg: -20, precoKg: 0.6, diferencaValor: -12.0, estado: 'falha' },
      { id: 'l2', artigoId: 'art-024', artigoNome: 'Cenoura', qtdFaturadaKg: 800, qtdRecebidaKg: 810, diferencaKg: 10, precoKg: 0.7, diferencaValor: 7.0, estado: 'excesso' },
    ],
  },

  // 5 ── Resolvida (creditação aceite pelo fornecedor) ───────────────────────
  {
    id: 'cnf-005',
    fornecedorId: 'for-005',
    fornecedorNome: 'Global Exotic Fruits BV',
    documentoFatura: 'INV GEF-2026-7741',
    dataRececao: '2026-07-25T05:00:00',
    estado: 'resolvida',
    totalFaturado: 1536.0,
    totalRecebidoValor: 1497.6,
    valorACreditar: 38.4,
    linhas: [
      { id: 'l1', artigoId: 'art-010', artigoNome: 'Manga Kent', qtdFaturadaKg: 360, qtdRecebidaKg: 348, diferencaKg: -12, precoKg: 3.2, diferencaValor: -38.4, estado: 'falha' },
      { id: 'l2', artigoId: 'art-011', artigoNome: 'Abacate Hass', qtdFaturadaKg: 320, qtdRecebidaKg: 320, diferencaKg: 0, precoKg: 4.8, diferencaValor: 0, estado: 'conforme' },
    ],
  },
]

export const CONFERENCIA_POR_ID: Record<string, Conferencia> = Object.fromEntries(CONFERENCIAS.map((c) => [c.id, c]))
