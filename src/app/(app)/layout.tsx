'use client'
// layout · app shell (sidebar + topbar com breadcrumb + guarda de sessão) · Eporifrutas Ops Hub

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { useAuth } from '@/contexts/auth-context'
import { useBreakpoint } from '@/hooks/use-breakpoint'
import { ROLE_LABELS } from '@/lib/auth/demo-auth'
import { T } from '@/lib/ui/theme'

const ROUTE_TITLE: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/encomendas': 'Receção de Encomendas',
  '/conferencia': 'Receção vs. Faturação',
  '/conta-corrente': 'Conta-corrente & Cobranças',
  '/analise': 'Análise de Tendências',
  '/clientes': 'Clientes',
  '/artigos': 'Artigos',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'

  useEffect(() => {
    if (loading) return
    if (!user) router.replace('/login')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: T.forest }}>
        <p className="text-sm animate-pulse" style={{ color: T.brandBright }}>A carregar…</p>
      </div>
    )
  }
  if (!user) return null

  const secao = Object.entries(ROUTE_TITLE).find(([k]) => pathname.startsWith(k))?.[1] ?? ''

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {!isMobile && (
          <header className="flex items-center justify-between px-6 shrink-0"
            style={{ height: 58, borderBottom: `1px solid ${T.line}`, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-2 text-[13px] min-w-0">
              <span className="font-semibold text-[var(--sub)]">Eporifrutas</span>
              <span style={{ color: T.lineStrong }}>/</span>
              <span className="font-semibold text-[var(--ink)] truncate">{secao}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 rounded-lg px-3 h-9 w-56 text-[13px]"
                style={{ backgroundColor: T.surfaceAlt, border: `1px solid ${T.line}`, color: T.muted }}>
                <Search size={14} />
                <span>Pesquisar…</span>
                <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#fff', border: `1px solid ${T.line}`, color: T.muted }}>⌘K</kbd>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide" style={{ backgroundColor: T.citrusSoft, color: '#9A5C06' }}>
                DEMO
              </span>
              <div className="flex items-center gap-2.5 pl-1">
                <div className="text-right leading-tight hidden sm:block">
                  <p className="text-[12px] font-semibold text-[var(--ink)]">{user.name}</p>
                  <p className="text-[10px]" style={{ color: T.brand }}>{ROLE_LABELS[user.role]}</p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ backgroundColor: T.brand }}>{user.avatar}</div>
              </div>
            </div>
          </header>
        )}

        <main style={{ flex: 1, overflowY: 'auto', paddingTop: isMobile ? 56 : 0 }}>
          <div className="fade-up" style={{ padding: isMobile ? '14px 14px 40px' : bp === 'tablet' ? '20px 20px 40px' : '26px 32px 48px', maxWidth: 1440, margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
