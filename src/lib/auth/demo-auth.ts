// demo-auth.ts · sistema de auth demo com papéis · sem Supabase · Eporifrutas Hub

export type UserRole = 'gestor' | 'comercial' | 'operacoes' | 'financeiro'

export interface DemoUser {
  id: string
  name: string
  email: string
  password: string // demo only
  role: UserRole
  avatar: string
  funcao?: string
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'u1', name: 'Ana Sequeira', email: 'direcao@eporifrutas.pt', password: 'epori',
    role: 'gestor', avatar: 'AS', funcao: 'Direção · Gestão',
  },
  {
    id: 'u2', name: 'Ricardo Martins', email: 'comercial@eporifrutas.pt', password: 'epori',
    role: 'comercial', avatar: 'RM', funcao: 'Comercial · Receção de encomendas',
  },
  {
    id: 'u3', name: 'Tiago Nunes', email: 'armazem@eporifrutas.pt', password: 'epori',
    role: 'operacoes', avatar: 'TN', funcao: 'Operações · Receção & Conferência',
  },
  {
    id: 'u4', name: 'Carla Pinto', email: 'financeiro@eporifrutas.pt', password: 'epori',
    role: 'financeiro', avatar: 'CP', funcao: 'Financeiro · Conta-corrente',
  },
]

const STORAGE_KEY = 'eporifrutas_demo_user'

export function getDemoUser(): DemoUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DemoUser) : null
  } catch { return null }
}

export function loginDemo(email: string, password: string): DemoUser | null {
  const user = DEMO_USERS.find(u => u.email === email && u.password === password)
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user ?? null
}

export function logoutDemo(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export const ROLE_LABELS: Record<UserRole, string> = {
  gestor: 'Gestão',
  comercial: 'Comercial',
  operacoes: 'Operações',
  financeiro: 'Financeiro',
}

// O que cada papel vê. Em demo a Gestão vê tudo; os restantes focam a sua função.
export const ROLE_MODULES: Record<UserRole, string[]> = {
  gestor:     ['dashboard', 'encomendas', 'conferencia', 'stock', 'vasilhame', 'conta-corrente', 'analise', 'clientes', 'artigos', 'procedimentos'],
  comercial:  ['dashboard', 'encomendas', 'stock', 'clientes', 'artigos', 'analise', 'procedimentos'],
  operacoes:  ['dashboard', 'conferencia', 'stock', 'vasilhame', 'artigos', 'procedimentos'],
  financeiro: ['dashboard', 'conta-corrente', 'vasilhame', 'clientes', 'analise', 'procedimentos'],
}

// Rota inicial após login por papel
export const ROLE_HOME: Record<UserRole, string> = {
  gestor: '/dashboard',
  comercial: '/encomendas',
  operacoes: '/conferencia',
  financeiro: '/conta-corrente',
}

// ─── Níveis de acesso (permissões por papel) ────────────────────────────────
export type Permissao =
  | 'cobranca.enviar'        // enviar email de cobrança
  | 'cobranca.editar-prazo'  // alterar o prazo de pagamento por cliente
  | 'cobranca.sincronizar'   // ler documentos do PHC
  | 'cobranca.editar-modelo' // definir o email-tipo (só administração)
  | 'encomendas.validar'     // aprovar e enviar encomendas ao PHC
  | 'conferencia.creditar'   // pedir creditação a fornecedores

// Rótulo do nível de acesso apresentado ao utilizador
export const ROLE_NIVEL: Record<UserRole, string> = {
  gestor: 'Administrador · acesso total',
  financeiro: 'Financeiro · cobranças',
  comercial: 'Comercial · encomendas',
  operacoes: 'Operações · armazém',
}

export const ROLE_PERMS: Record<UserRole, Permissao[]> = {
  gestor: ['cobranca.enviar', 'cobranca.editar-prazo', 'cobranca.sincronizar', 'cobranca.editar-modelo', 'encomendas.validar', 'conferencia.creditar'],
  financeiro: ['cobranca.enviar', 'cobranca.editar-prazo', 'cobranca.sincronizar'],
  comercial: ['encomendas.validar'],
  operacoes: ['conferencia.creditar'],
}

export function podeFazer(role: UserRole, p: Permissao): boolean {
  return ROLE_PERMS[role].includes(p)
}
