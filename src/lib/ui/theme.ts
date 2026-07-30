// theme · tokens de design partilhados (paleta, tons, sombras) · Eporifrutas Ops Hub
// Fonte única da linguagem visual — importado por primitivas e páginas para consistência total.

export const T = {
  // Marca
  forest: '#0E3B24', // sidebar / navy verde profundo
  forestHover: '#17492F',
  forestSoft: '#12432A',
  brand: '#1B8A4B', // verde primário (ações, ativo) — sóbrio e corporativo
  brandBright: '#2FA85B', // realce vivo pontual
  brandDark: '#166E3C',
  brandSoft: '#EAF4EC', // fundo verde suave
  brandSofter: '#F2F8F3',

  // Acentos
  citrus: '#E0870B', // financeiro / a-creditar
  citrusSoft: '#FBEFD9',
  tomato: '#D4462A', // negativo / vencido
  tomatoSoft: '#FBE9E5',
  sky: '#2A88AC',
  skySoft: '#E4F1F6',
  violet: '#7A5AF0',
  violetSoft: '#EFEBFC',

  // Neutros
  ink: '#15231B', // texto primário (verde-tinta quase preto)
  sub: '#57655C', // texto secundário
  muted: '#8A968E', // texto terciário / labels
  line: '#E6EAE7', // borda hairline
  lineStrong: '#D7DDD8',
  canvas: '#F3F5F3', // fundo da app
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAF8', // linhas alternadas / cabeçalhos de tabela
} as const

// Sombras (elevação por camadas)
export const SHADOW = {
  sm: '0 1px 2px rgba(15,44,28,0.04), 0 1px 2px rgba(15,44,28,0.06)',
  md: '0 2px 4px rgba(15,44,28,0.04), 0 4px 12px rgba(15,44,28,0.06)',
  lg: '0 8px 28px rgba(15,44,28,0.10)',
} as const

// Tons semânticos (badges, estados, stats)
export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'citrus'

export const TONE: Record<Tone, { bg: string; fg: string; ring: string; dot: string }> = {
  neutral: { bg: '#F1F4F2', fg: '#57655C', ring: '#E1E6E2', dot: '#94A19A' },
  brand: { bg: T.brandSoft, fg: T.brandDark, ring: '#CDE7D5', dot: T.brand },
  success: { bg: '#E7F5EC', fg: '#1B7A43', ring: '#C9E9D5', dot: '#2FA85B' },
  warning: { bg: '#FDF3E0', fg: '#9A6206', ring: '#F5E2BE', dot: '#E0870B' },
  danger: { bg: T.tomatoSoft, fg: '#B23A20', ring: '#F3D2CA', dot: T.tomato },
  info: { bg: T.skySoft, fg: '#1F6B88', ring: '#CDE6EF', dot: T.sky },
  violet: { bg: T.violetSoft, fg: '#5B41C4', ring: '#DCD3F7', dot: T.violet },
  citrus: { bg: T.citrusSoft, fg: '#9A5C06', ring: '#F3DCB4', dot: T.citrus },
}

// Formatação pt-PT (partilhada)
export const eur = (n: number, casas = 2) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: casas, maximumFractionDigits: casas }).format(n)
export const eur0 = (n: number) => eur(n, 0)
export const num = (n: number, casas = 0) =>
  new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 0, maximumFractionDigits: casas }).format(n)
export const kg = (n: number, casas = 0) => num(n, casas) + ' kg'
export const pct = (n: number) => (n > 0 ? '+' : '') + num(n, 1) + '%'
