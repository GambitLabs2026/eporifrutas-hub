// types · modelo de domínio partilhado (demo) · Eporifrutas Hub
// Contrato único de dados consumido por todos os módulos. Sem dependências externas.
// Regra de ouro do negócio: o PHC regista SEMPRE em Kg — a conversão vive em `converterParaKg`.

// ─────────────────────────────────────────────────────────────────────────────
// Unidades e conversão (a peça central e transversal)
// ─────────────────────────────────────────────────────────────────────────────

export type Unidade = 'kg' | 'caixa' | 'palete' | 'unidade' | 'saco' | 'molho'

export const UNIDADE_LABEL: Record<Unidade, string> = {
  kg: 'Kg',
  caixa: 'Caixa',
  palete: 'Palete',
  unidade: 'Unidade',
  saco: 'Saco',
  molho: 'Molho',
}

// ─────────────────────────────────────────────────────────────────────────────
// Artigos (produtos) — cada artigo traz os seus fatores de conversão para Kg
// ─────────────────────────────────────────────────────────────────────────────

export type CategoriaArtigo = 'frutamania' | 'da-horta' | 'shake-it-up'

export const CATEGORIA_LABEL: Record<CategoriaArtigo, string> = {
  frutamania: 'Frutamania',
  'da-horta': 'Da Horta',
  'shake-it-up': 'Shake it up',
}

export interface Artigo {
  id: string
  codigoPhc: string
  nome: string
  categoria: CategoriaArtigo
  origem: string // país / região
  epoca?: string // ex. "todo o ano", "jun–set"
  precoKg: number // €/kg de referência
  // Fatores de conversão para Kg (peso médio). null = não vendido nessa unidade.
  kgPorCaixa: number | null
  kgPorPalete: number | null
  kgPorUnidade: number | null
  kgPorSaco?: number | null
  kgPorMolho?: number | null
  unidadeHabitual: Unidade // como o cliente costuma pedir
  exotico?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Fornecedores / produtores
// ─────────────────────────────────────────────────────────────────────────────

export interface Fornecedor {
  id: string
  nome: string
  nif: string
  pais: string
  categorias: CategoriaArtigo[]
  contacto: string
  email: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Clientes (por canal) + condições comerciais
// ─────────────────────────────────────────────────────────────────────────────

export type Canal = 'grossista' | 'horeca' | 'cruzeiro' | 'supermercado'

export const CANAL_LABEL: Record<Canal, string> = {
  grossista: 'Grossista',
  horeca: 'HORECA',
  cruzeiro: 'Navios / Cruzeiros',
  supermercado: 'Supermercado',
}

// Como a encomenda chega (a IA lê em qualquer formato)
export type FormatoEncomenda = 'email' | 'pdf' | 'excel' | 'imagem' | 'whatsapp'

export const FORMATO_LABEL: Record<FormatoEncomenda, string> = {
  email: 'Email (texto)',
  pdf: 'PDF anexo',
  excel: 'Ficheiro Excel',
  imagem: 'Foto / imagem',
  whatsapp: 'WhatsApp',
}

export interface Cliente {
  id: string
  nome: string
  canal: Canal
  nif: string
  contactoNome: string
  email: string
  telefone: string
  localidade: string
  prazoPagamentoDias: number // 30 / 60 / 90
  formatoHabitual: FormatoEncomenda
  saldo: number // conta-corrente € (positivo = deve à Eporifrutas)
  ativo: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// MÓDULO 1 — Receção de encomendas (email/PDF/Excel → validação → PHC)
// ─────────────────────────────────────────────────────────────────────────────

export type EstadoEncomenda =
  | 'nova' // acabou de chegar, ainda não processada
  | 'extraida' // extração automática concluída, aguarda validação
  | 'em-validacao' // responsável a rever
  | 'aprovada' // validada, pronta a enviar ao PHC
  | 'enviada-phc' // registada no PHC
  | 'erro' // falha na extração / precisa de atenção

export const ESTADO_ENCOMENDA_LABEL: Record<EstadoEncomenda, string> = {
  nova: 'Nova',
  extraida: 'Extraída',
  'em-validacao': 'Em validação',
  aprovada: 'Aprovada',
  'enviada-phc': 'Enviada ao PHC',
  erro: 'Requer atenção',
}

export type EstadoLinha = 'ok' | 'aviso' | 'nao-reconhecido'

export interface EncomendaLinha {
  id: string
  textoOriginal: string // exatamente o que o cliente escreveu, ex. "10 cx maçã royal gala"
  artigoId: string | null // null se não reconhecido
  artigoNome: string // nome resolvido (ou "?" se por reconhecer)
  quantidadeOriginal: number
  unidadeOriginal: Unidade
  quantidadeKg: number // convertida para Kg (o que vai ao PHC)
  precoKg: number
  confianca: number // 0–100 confiança da extração desta linha
  estado: EstadoLinha
  sugestao?: string // sugestão quando não reconhecido / aviso
}

export interface Encomenda {
  id: string
  referencia: string
  clienteId: string
  clienteNome: string
  canal: Canal
  origem: FormatoEncomenda
  ficheiro: string // nome do ficheiro / assunto do email
  recebidaEm: string // ISO
  estado: EstadoEncomenda
  confiancaGlobal: number // 0–100
  linhas: EncomendaLinha[]
  notas?: string // observações extraídas (ex. "entregar antes das 8h")
  avisos: string[] // alertas ao validador
  validadaPor?: string
  validadaEm?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// MÓDULO 2 — Receção vs Faturação (conferência + creditação a fornecedores)
// ─────────────────────────────────────────────────────────────────────────────

export type EstadoConferenciaLinha = 'conforme' | 'falha' | 'excesso'

export interface ConferenciaLinha {
  id: string
  artigoId: string
  artigoNome: string
  qtdFaturadaKg: number
  qtdRecebidaKg: number
  diferencaKg: number // recebida - faturada (negativo = falta)
  precoKg: number
  diferencaValor: number // impacto € (negativo = a creditar a nosso favor)
  estado: EstadoConferenciaLinha
}

export type EstadoConferencia = 'conforme' | 'com-discrepancia' | 'creditacao-pedida' | 'resolvida'

export const ESTADO_CONFERENCIA_LABEL: Record<EstadoConferencia, string> = {
  conforme: 'Conforme',
  'com-discrepancia': 'Com discrepância',
  'creditacao-pedida': 'Creditação pedida',
  resolvida: 'Resolvida',
}

export interface Conferencia {
  id: string
  fornecedorId: string
  fornecedorNome: string
  documentoFatura: string
  dataRececao: string // ISO
  linhas: ConferenciaLinha[]
  estado: EstadoConferencia
  totalFaturado: number
  totalRecebidoValor: number
  valorACreditar: number // € a pedir ao fornecedor
}

// ─────────────────────────────────────────────────────────────────────────────
// MÓDULO 3 — Conta-corrente de clientes + cobranças
// ─────────────────────────────────────────────────────────────────────────────

export type TipoMovimento = 'fatura' | 'pagamento' | 'nota-credito'
export type EstadoMovimento = 'pago' | 'pendente' | 'vencido'

export interface Movimento {
  id: string
  clienteId: string
  clienteNome: string
  tipo: TipoMovimento
  documento: string
  data: string // ISO emissão
  vencimento: string // ISO
  valor: number // € (fatura positivo, pagamento/NC negativo)
  estado: EstadoMovimento
  diasAtraso: number // 0 se não vencido
}

export type AcaoCobranca = 'lembrete' | 'contacto' | 'suspender' | 'juridico'

export const ACAO_COBRANCA_LABEL: Record<AcaoCobranca, string> = {
  lembrete: 'Enviar lembrete',
  contacto: 'Contacto telefónico',
  suspender: 'Suspender fornecimento',
  juridico: 'Escalar p/ jurídico',
}

export interface AlertaCobranca {
  id: string
  clienteId: string
  clienteNome: string
  canal: Canal
  valorVencido: number
  diasAtrasoMax: number
  numDocsVencidos: number
  acaoSugerida: AcaoCobranca
}

// ─────────────────────────────────────────────────────────────────────────────
// Conversão para Kg — a função central do negócio
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converte uma quantidade numa dada unidade para Kg, usando os fatores do artigo.
 * Devolve null quando o artigo não define fator para essa unidade.
 */
export function converterParaKg(
  artigo: Pick<Artigo, 'kgPorCaixa' | 'kgPorPalete' | 'kgPorUnidade' | 'kgPorSaco' | 'kgPorMolho'>,
  quantidade: number,
  unidade: Unidade,
): number | null {
  switch (unidade) {
    case 'kg':
      return quantidade
    case 'caixa':
      return artigo.kgPorCaixa != null ? quantidade * artigo.kgPorCaixa : null
    case 'palete':
      return artigo.kgPorPalete != null ? quantidade * artigo.kgPorPalete : null
    case 'unidade':
      return artigo.kgPorUnidade != null ? quantidade * artigo.kgPorUnidade : null
    case 'saco':
      return artigo.kgPorSaco != null ? quantidade * artigo.kgPorSaco : null
    case 'molho':
      return artigo.kgPorMolho != null ? quantidade * artigo.kgPorMolho : null
    default:
      return null
  }
}
