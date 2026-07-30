// procedimentos · base de conhecimento partilhada (SOPs) que alimenta o assistente interno · Eporifrutas Ops Hub

export type CategoriaProc = 'Receção' | 'Conferência' | 'Cobranças' | 'Qualidade' | 'Logística' | 'Geral'

export const CATEGORIAS_PROC: CategoriaProc[] = ['Receção', 'Conferência', 'Cobranças', 'Qualidade', 'Logística', 'Geral']

export interface Procedimento {
  id: string
  titulo: string
  categoria: CategoriaProc
  autor: string
  atualizado: string // ISO
  tags: string[]
  passos: string[]
}

export const PROCEDIMENTOS: Procedimento[] = [
  {
    id: 'proc-01', titulo: 'Validar uma encomenda antes de enviar ao PHC', categoria: 'Receção', autor: 'Ricardo Martins', atualizado: '2026-07-24',
    tags: ['encomenda', 'validar', 'phc', 'kg', 'extração', 'ia'],
    passos: [
      'Abrir a encomenda na Receção e confirmar o cliente e a origem (email, PDF, Excel, foto ou WhatsApp).',
      'Rever cada linha: o texto do cliente deve corresponder ao artigo e código PHC corretos.',
      'Confirmar a conversão para Kg — é sempre em Kg que entra no PHC.',
      'Resolver linhas assinaladas a amarelo (aviso) ou vermelho (não reconhecido) antes de avançar.',
      'Carregar em “Rever e enviar ao PHC”, verificar o payload e confirmar o envio por API.',
    ],
  },
  {
    id: 'proc-02', titulo: 'Artigo não reconhecido pela IA — o que fazer', categoria: 'Receção', autor: 'Ricardo Martins', atualizado: '2026-07-20',
    tags: ['artigo', 'não reconhecido', 'catálogo', 'ia', 'correspondência'],
    passos: [
      'Verificar se é um produto novo ou apenas uma grafia diferente de um artigo existente.',
      'Se existir no catálogo, associar manualmente ao artigo/código PHC correto.',
      'Se for novo, pedir a criação do artigo ao responsável de catálogo (com origem, época e fatores de conversão).',
      'Nunca enviar ao PHC uma linha não reconhecida — a encomenda fica bloqueada até resolver.',
    ],
  },
  {
    id: 'proc-03', titulo: 'Conferência de mercadoria à entrada vs. fatura do fornecedor', categoria: 'Conferência', autor: 'Tiago Nunes', atualizado: '2026-07-22',
    tags: ['conferência', 'receção', 'fornecedor', 'báscula', 'kg', 'fatura', 'discrepância'],
    passos: [
      'Pesar toda a mercadoria em Kg na báscula à entrada, independentemente de vir em paletes ou caixas.',
      'Comparar o peso recebido com o peso faturado pelo fornecedor, linha a linha.',
      'Assinalar falhas (recebido a menos) e excessos (recebido a mais).',
      'Para falhas relevantes, preparar pedido de creditação ao fornecedor (ver procedimento próprio).',
    ],
  },
  {
    id: 'proc-04', titulo: 'Pedido de creditação a fornecedor', categoria: 'Conferência', autor: 'Tiago Nunes', atualizado: '2026-07-18',
    tags: ['creditação', 'fornecedor', 'discrepância', 'falha', 'nota de crédito'],
    passos: [
      'Na Conferência, abrir o documento com discrepância e confirmar o valor a creditar.',
      'Carregar em “Pedir creditação ao fornecedor” — o estado passa a “Creditação pedida”.',
      'Anexar as evidências (pesagem/foto) e enviar ao fornecedor.',
      'Acompanhar até à emissão da nota de crédito e marcar como resolvida.',
    ],
  },
  {
    id: 'proc-05', titulo: 'Cobrança de clientes por níveis de atraso', categoria: 'Cobranças', autor: 'Carla Pinto', atualizado: '2026-07-28',
    tags: ['cobrança', 'atraso', 'email', 'cliente', 'vencido', 'lembrete', 'prazo'],
    passos: [
      'O sistema gera automaticamente um alerta quando um cliente passa o prazo de pagamento definido.',
      'Até 15 dias: enviar lembrete amigável. 16–45 dias: contacto/recordação firme. >45 dias: aviso/notificação final.',
      'Carregar em “Enviar email” — o modelo é preenchido automaticamente com o cliente, documentos e dias de atraso.',
      'Rever a mensagem e enviar. O alerta fica marcado como “Email enviado”.',
      'Quando o PHC gera o recibo, a fatura é liquidada e o cliente regulariza-se automaticamente.',
    ],
  },
  {
    id: 'proc-06', titulo: 'Definir o prazo de pagamento de um cliente', categoria: 'Cobranças', autor: 'Carla Pinto', atualizado: '2026-07-26',
    tags: ['prazo', 'pagamento', 'cliente', 'dias', 'conta-corrente'],
    passos: [
      'Abrir a Conta-corrente e localizar o cliente na tabela de saldos.',
      'Editar o campo “Prazo (dias)” com o número de dias acordado (ex.: 30, 60, 90).',
      'O sistema recalcula automaticamente os vencimentos e os alertas de cobrança.',
      'Apenas Administrador e Financeiro têm permissão para alterar prazos.',
    ],
  },
  {
    id: 'proc-07', titulo: 'Controlo da cadeia de frio na receção', categoria: 'Qualidade', autor: 'Equipa Qualidade', atualizado: '2026-07-15',
    tags: ['qualidade', 'frio', 'temperatura', 'receção', 'segurança alimentar', 'hccp'],
    passos: [
      'Medir e registar a temperatura do veículo e do produto no momento da descarga.',
      'Rejeitar lotes fora dos limites definidos e registar a ocorrência.',
      'Encaminhar de imediato para câmara de frio à temperatura adequada por tipo de produto.',
      'Guardar o registo para efeitos de rastreabilidade e auditoria.',
    ],
  },
  {
    id: 'proc-08', titulo: 'Rastreabilidade por lote', categoria: 'Qualidade', autor: 'Equipa Qualidade', atualizado: '2026-07-10',
    tags: ['rastreabilidade', 'lote', 'qualidade', 'origem', 'recolha'],
    passos: [
      'Registar o lote e a origem de cada entrada de mercadoria.',
      'Associar o lote às expedições para clientes.',
      'Em caso de alerta, permitir localizar rapidamente para onde foi enviado cada lote.',
    ],
  },
  {
    id: 'proc-09', titulo: 'Preparação de carga para navios e cruzeiros', categoria: 'Logística', autor: 'Miguel (Logística)', atualizado: '2026-07-12',
    tags: ['navios', 'cruzeiros', 'logística', 'carga', 'porto', 'expedição', 'frota'],
    passos: [
      'Confirmar a hora de escala do navio e a janela de entrega no porto.',
      'Separar a encomenda com prioridade e verificar a cadeia de frio.',
      'Preparar documentação de expedição e transporte frigorífico com GPS.',
      'Entregar no cais dentro da janela e confirmar a receção.',
    ],
  },
  {
    id: 'proc-10', titulo: 'Abertura de novo cliente e canal', categoria: 'Geral', autor: 'Ana Sequeira', atualizado: '2026-07-08',
    tags: ['cliente', 'novo', 'canal', 'horeca', 'grossista', 'cadastro'],
    passos: [
      'Recolher os dados: nome, NIF, contacto, canal (grossista, HORECA, cruzeiro, supermercado).',
      'Definir o prazo de pagamento e o formato habitual de encomenda.',
      'Registar no cadastro e confirmar a sincronização com o PHC.',
    ],
  },
]

export const PROC_POR_ID: Record<string, Procedimento> = Object.fromEntries(PROCEDIMENTOS.map(p => [p.id, p]))
