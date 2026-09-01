'use client'
// sidebar · navegação agrupada premium · Eporifrutas Ops Hub

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Inbox, PackageCheck, Wallet, TrendingUp, Users, Apple, MessagesSquare, Boxes, Recycle,
  ChevronLeft, ChevronRight, Menu, X, LogOut, Sprout,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { ROLE_MODULES, ROLE_LABELS } from '@/lib/auth/demo-auth'
import { useState } from 'react'
import { useBreakpoint } from '@/hooks/use-breakpoint'

interface NavItem { href: string; label: string; moduleKey: string; icon: React.ElementType; group: string }

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', moduleKey: 'dashboard', icon: LayoutDashboard, group: '' },
  { href: '/encomendas', label: 'Receção de Encomendas', moduleKey: 'encomendas', icon: Inbox, group: 'Operação' },
  { href: '/conferencia', label: 'Receção vs. Faturação', moduleKey: 'conferencia', icon: PackageCheck, group: 'Operação' },
  { href: '/stock', label: 'Stock do Armazém', moduleKey: 'stock', icon: Boxes, group: 'Armazém' },
  { href: '/vasilhame', label: 'Gestão de Vasilhame', moduleKey: 'vasilhame', icon: Recycle, group: 'Armazém' },
  { href: '/conta-corrente', label: 'Conta-corrente & Cobranças', moduleKey: 'conta-corrente', icon: Wallet, group: 'Financeiro' },
  { href: '/analise', label: 'Análise de Tendências', moduleKey: 'analise', icon: TrendingUp, group: 'Análise' },
  { href: '/clientes', label: 'Clientes', moduleKey: 'clientes', icon: Users, group: 'Cadastro' },
  { href: '/artigos', label: 'Artigos', moduleKey: 'artigos', icon: Apple, group: 'Cadastro' },
  { href: '/procedimentos', label: 'Procedimentos & Assistente', moduleKey: 'procedimentos', icon: MessagesSquare, group: 'Conhecimento' },
]

const FOREST = '#0E3B24'
const FOREST_HOVER = '#17492F'
const BRAND = '#2FA85B'
const TEXT = '#E7EFE9'
const TEXT_DIM = 'rgba(231,239,233,0.55)'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const bp = useBreakpoint()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isTablet = bp === 'tablet'
  const isMobile = bp === 'mobile'
  const effectiveCollapsed = isTablet ? true : collapsed

  const allowed = user ? ROLE_MODULES[user.role] : []
  const visible = navItems.filter(i => allowed.includes(i.moduleKey))

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const handleSignOut = () => { signOut(); router.push('/login') }

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => {
    const compact = effectiveCollapsed && !mobile
    let lastGroup = ''
    return (
      <>
        {/* Logo */}
        <div className={cn('flex items-center gap-2.5 px-4 border-b shrink-0', compact ? 'justify-center px-2 py-4' : 'py-4')}
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <span className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(47,168,91,0.16)' }}>
            <Sprout size={18} style={{ color: BRAND }} />
          </span>
          {!compact && (
            <div className="leading-none">
              <p className="text-[15px] font-black tracking-[0.14em]" style={{ color: TEXT }}>EPORIFRUTAS</p>
              <p className="text-[8.5px] tracking-[0.2em] font-bold mt-1" style={{ color: BRAND }}>CAMADA PRÉ-PHC</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5 scrollbar-hide">
          {visible.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const showGroup = !compact && item.group && item.group !== lastGroup
            lastGroup = item.group
            return (
              <div key={item.href}>
                {showGroup && (
                  <p className="px-2.5 pt-3.5 pb-1 text-[9.5px] font-bold tracking-[0.16em] uppercase" style={{ color: 'rgba(231,239,233,0.38)' }}>
                    {item.group}
                  </p>
                )}
                <Link
                  href={item.href}
                  onClick={() => mobile && setMobileOpen(false)}
                  className={cn('relative flex items-center gap-3 rounded-[9px] px-2.5 py-2 text-[13px] font-medium transition-colors',
                    compact ? 'justify-center px-2' : '')}
                  style={{ backgroundColor: active ? 'rgba(47,168,91,0.16)' : 'transparent', color: active ? '#fff' : 'rgba(231,239,233,0.78)' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = FOREST_HOVER }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
                  title={compact ? item.label : undefined}
                >
                  {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full" style={{ backgroundColor: BRAND }} />}
                  <Icon size={17} className="shrink-0" style={{ color: active ? BRAND : 'currentColor' }} />
                  {!compact && <span className="leading-tight truncate">{item.label}</span>}
                </Link>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-2.5 space-y-1 shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {!compact && user && (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ backgroundColor: BRAND, color: '#08130C' }}>{user.avatar}</div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold truncate" style={{ color: TEXT }}>{user.name}</p>
                <p className="text-[10px] truncate" style={{ color: 'rgba(231,239,233,0.5)' }}>{ROLE_LABELS[user.role]}</p>
              </div>
              <button onClick={handleSignOut} title="Sair" className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors"
                style={{ color: TEXT_DIM }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = FOREST_HOVER; e.currentTarget.style.color = TEXT }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = TEXT_DIM }}>
                <LogOut size={14} />
              </button>
            </div>
          )}

          {compact && (
            <button onClick={handleSignOut} title="Sair"
              className="w-full flex items-center justify-center rounded-lg px-2 py-2 transition-colors" style={{ color: TEXT_DIM }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = FOREST_HOVER; e.currentTarget.style.color = TEXT }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = TEXT_DIM }}>
              <LogOut size={15} />
            </button>
          )}

          {!mobile && !isTablet && (
            <button onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors" style={{ color: TEXT_DIM }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = FOREST_HOVER; e.currentTarget.style.color = TEXT }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = TEXT_DIM }}>
              {collapsed ? <ChevronRight size={14} className="mx-auto" /> : <><ChevronLeft size={14} /><span>Recolher</span></>}
            </button>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      {!isMobile && (
        <aside className={cn('flex h-screen flex-col transition-all duration-200 shrink-0', isTablet || collapsed ? 'w-[60px]' : 'w-[236px]')}
          style={{ backgroundColor: FOREST }}>
          <SidebarContent />
        </aside>
      )}

      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b"
          style={{ backgroundColor: FOREST, borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2">
            <Sprout size={18} style={{ color: BRAND }} />
            <span className="text-sm font-black tracking-[0.14em]" style={{ color: TEXT }}>EPORIFRUTAS</span>
          </div>
          <button onClick={() => setMobileOpen(true)} style={{ color: TEXT }}><Menu size={22} /></button>
        </div>
      )}

      {isMobile && (
        <>
          {mobileOpen && <div className="fixed inset-0 z-[199]" style={{ background: '#0007' }} onClick={() => setMobileOpen(false)} />}
          <div className="fixed top-0 bottom-0 z-[200] flex flex-col overflow-hidden"
            style={{ left: mobileOpen ? 0 : -288, width: 288, backgroundColor: FOREST, transition: 'left 0.3s ease' }}>
            <div className="flex items-center justify-between px-4 py-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2">
                <Sprout size={20} style={{ color: BRAND }} />
                <p className="text-sm font-black tracking-[0.14em]" style={{ color: TEXT }}>EPORIFRUTAS</p>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ color: TEXT }}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col"><SidebarContent mobile /></div>
          </div>
        </>
      )}
    </>
  )
}
