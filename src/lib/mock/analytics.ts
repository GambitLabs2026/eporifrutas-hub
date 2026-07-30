// analytics · séries e agregados de vendas para o módulo de tendências (demo) · Eporifrutas Hub
// Comparação "a nossa análise" vs. PHC — dados fictícios mas coerentes.

export interface PontoMensal {
  mes: string // 'Ago', 'Set', ...
  valor: number // € faturado
  kg: number // volume em Kg
}

export interface FatiaCategoria {
  categoria: 'Frutamania' | 'Da Horta' | 'Shake it up'
  valor: number
  cor: string
}

export interface FatiaCanal {
  canal: 'Grossista' | 'HORECA' | 'Navios / Cruzeiros' | 'Supermercado'
  valor: number
  kg: number
  variacao: number // % vs período homólogo
}

export interface TopArtigo {
  nome: string
  categoria: string
  kg: number
  valor: number
  variacao: number // % vs mês anterior
}

// Últimos 12 meses (ago/25 → jul/26)
export const VENDAS_MENSAIS: PontoMensal[] = [
  { mes: 'Ago', valor: 412000, kg: 318000 },
  { mes: 'Set', valor: 438000, kg: 335000 },
  { mes: 'Out', valor: 456000, kg: 349000 },
  { mes: 'Nov', valor: 471000, kg: 362000 },
  { mes: 'Dez', valor: 528000, kg: 391000 },
  { mes: 'Jan', valor: 449000, kg: 344000 },
  { mes: 'Fev', valor: 462000, kg: 351000 },
  { mes: 'Mar', valor: 495000, kg: 372000 },
  { mes: 'Abr', valor: 508000, kg: 384000 },
  { mes: 'Mai', valor: 534000, kg: 402000 },
  { mes: 'Jun', valor: 561000, kg: 419000 },
  { mes: 'Jul', valor: 583000, kg: 431000 },
]

export const VENDAS_POR_CATEGORIA: FatiaCategoria[] = [
  { categoria: 'Frutamania', valor: 342000, cor: '#2E9E4F' },
  { categoria: 'Da Horta', valor: 198000, cor: '#F39A1E' },
  { categoria: 'Shake it up', valor: 43000, cor: '#3FA7C7' },
]

export const VENDAS_POR_CANAL: FatiaCanal[] = [
  { canal: 'Supermercado', valor: 231000, kg: 189000, variacao: 8.4 },
  { canal: 'Grossista', valor: 168000, kg: 142000, variacao: 3.1 },
  { canal: 'Navios / Cruzeiros', valor: 121000, kg: 61000, variacao: 14.2 },
  { canal: 'HORECA', valor: 63000, kg: 39000, variacao: -2.6 },
]

export const TOP_ARTIGOS: TopArtigo[] = [
  { nome: 'Maçã Royal Gala', categoria: 'Frutamania', kg: 48200, valor: 57840, variacao: 6.2 },
  { nome: 'Batata Agria', categoria: 'Da Horta', kg: 92000, valor: 55200, variacao: -1.4 },
  { nome: 'Banana da Madeira', categoria: 'Frutamania', kg: 31500, valor: 42525, variacao: 9.8 },
  { nome: 'Laranja do Algarve', categoria: 'Frutamania', kg: 38900, valor: 36955, variacao: 4.1 },
  { nome: 'Tomate Chucha', categoria: 'Da Horta', kg: 21400, valor: 29960, variacao: 2.7 },
  { nome: 'Uva sem Grainha', categoria: 'Frutamania', kg: 9800, valor: 25480, variacao: 18.3 },
  { nome: 'Pimento Vermelho', categoria: 'Da Horta', kg: 11200, valor: 21280, variacao: -3.9 },
  { nome: 'Abacate Hass', categoria: 'Frutamania', kg: 3900, valor: 18720, variacao: 22.5 },
]

// Insight destacado (a nossa análise vs. o que o PHC mostra)
export const INSIGHTS: { titulo: string; texto: string; tipo: 'alta' | 'baixa' | 'info' }[] = [
  { titulo: 'Navios/Cruzeiros a acelerar', texto: 'Canal cresceu 14,2% vs. período homólogo — margem acima da média. Reforçar stock de exóticos no pico de escalas (jul–set).', tipo: 'alta' },
  { titulo: 'HORECA em ligeira quebra', texto: 'Queda de 2,6%. Concentração em 2 clientes; risco de dependência. Sugerida ação comercial no segmento hotéis.', tipo: 'baixa' },
  { titulo: 'Exóticos com maior variação', texto: 'Abacate (+22,5%) e Uva (+18,3%) lideram crescimento — oportunidade de gama premium.', tipo: 'info' },
]
