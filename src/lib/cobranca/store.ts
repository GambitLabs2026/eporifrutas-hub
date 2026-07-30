// store · persistência local (demo) de prazos de pagamento por cliente + emails de cobrança enviados
// Partilhado entre o dashboard e a conta-corrente via localStorage. SSR-safe.

import { prazosPorDefeito, MODELO_PADRAO, type ModeloEmail } from './engine'

const KEY_PRAZOS = 'epori_prazos_v1'
const KEY_EMAILS = 'epori_cobranca_emails_v1'
const KEY_DOCS = 'epori_phc_docs_lidos_v1'
const KEY_MODELO = 'epori_modelo_email_v1'

function ler<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...(JSON.parse(raw) as T) } : fallback
  } catch {
    return fallback
  }
}
function escrever(key: string, val: unknown) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* ignore */ }
}

// Prazos de pagamento (dias) por cliente — seed a partir dos valores base
export function carregarPrazos(): Record<string, number> {
  return ler<Record<string, number>>(KEY_PRAZOS, prazosPorDefeito())
}
export function guardarPrazo(clienteId: string, dias: number): Record<string, number> {
  const atual = carregarPrazos()
  const novo = { ...atual, [clienteId]: dias }
  escrever(KEY_PRAZOS, novo)
  return novo
}

// Emails de cobrança enviados: clienteId -> ISO timestamp
export function carregarEmailsEnviados(): Record<string, string> {
  return ler<Record<string, string>>(KEY_EMAILS, {})
}
export function marcarEmailEnviado(clienteId: string, quando: string): Record<string, string> {
  const atual = carregarEmailsEnviados()
  const novo = { ...atual, [clienteId]: quando }
  escrever(KEY_EMAILS, novo)
  return novo
}

// Documentos do PHC já lidos (ids) — faturas e recibos sincronizados
export function carregarDocsLidos(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY_DOCS)
    const v = raw ? JSON.parse(raw) : []
    return Array.isArray(v) ? (v as string[]) : []
  } catch {
    return []
  }
}
export function guardarDocsLidos(ids: string[]): string[] {
  escrever(KEY_DOCS, ids)
  return ids
}

// Modelo-tipo de email de cobrança (editável, com marcadores)
export function carregarModelo(): ModeloEmail {
  return ler<ModeloEmail>(KEY_MODELO, MODELO_PADRAO)
}
export function guardarModelo(m: ModeloEmail): ModeloEmail {
  escrever(KEY_MODELO, m)
  return m
}
