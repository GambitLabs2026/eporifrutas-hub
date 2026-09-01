'use client'
// login · página de entrada premium (split-screen) · Eporifrutas Ops Hub

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sprout, Inbox, PackageCheck, Wallet, TrendingUp, ArrowRight } from 'lucide-react'
import { loginDemo, DEMO_USERS, DemoUser, ROLE_LABELS, ROLE_HOME } from '@/lib/auth/demo-auth'
import { useAuth } from '@/contexts/auth-context'
import { T } from '@/lib/ui/theme'

const FOREST = '#0E3B24'
const BRAND = '#2FA85B'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const user = loginDemo(email, password)
    if (!user) { setError('Email ou password incorretos.'); setLoading(false); return }
    setUser(user); router.push(ROLE_HOME[user.role])
  }
  const fill = (u: DemoUser) => { setEmail(u.email); setPassword(u.password); setError('') }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr]">
      {/* Painel de marca (desktop) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden" style={{ backgroundColor: FOREST }}>
        <div className="absolute inset-0 opacity-[0.22] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, #2FA85B 0%, transparent 45%), radial-gradient(circle at 85% 80%, #E0870B 0%, transparent 50%)' }} />
        <div className="relative flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(47,168,91,0.18)' }}>
            <Sprout size={24} style={{ color: BRAND }} />
          </span>
          <div className="leading-none">
            <p className="text-2xl font-black tracking-[0.14em] text-white">EPORIFRUTAS</p>
            <p className="text-[10px] tracking-[0.24em] font-bold mt-1.5" style={{ color: BRAND }}>CAMADA PRÉ-PHC</p>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-[28px] font-bold text-white leading-tight max-w-md">Da receção da encomenda ao PHC — sem trabalho manual, com controlo total.</h2>
          <p className="text-[14px] mt-4 max-w-md" style={{ color: 'rgba(231,239,233,0.7)' }}>
            Uma camada inteligente que lê emails, PDF e Excel dos clientes, converte tudo para Kg e valida antes de entrar no PHC.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-8 max-w-md">
            {[
              { icon: Inbox, t: 'Receção inteligente', s: 'Email · PDF · Excel → Kg' },
              { icon: PackageCheck, t: 'Conferência', s: 'Recebido vs. faturado' },
              { icon: Wallet, t: 'Cobranças', s: 'Alertas automáticos' },
              { icon: TrendingUp, t: 'Análise', s: 'Tendências de compra' },
            ].map((f, i) => (
              <div key={i} className="rounded-xl p-3.5" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <f.icon size={18} style={{ color: BRAND }} />
                <p className="text-[13px] font-semibold text-white mt-2">{f.t}</p>
                <p className="text-[11px]" style={{ color: 'rgba(231,239,233,0.55)' }}>{f.s}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[11px]" style={{ color: 'rgba(231,239,233,0.4)' }}>Protótipo demonstrativo · dados fictícios</p>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center p-6 sm:p-10" style={{ backgroundColor: T.canvas }}>
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <Sprout size={26} style={{ color: T.brand }} />
            <p className="text-xl font-black tracking-[0.12em]" style={{ color: FOREST }}>EPORIFRUTAS</p>
          </div>

          <h1 className="text-[22px] font-bold text-[var(--ink)]">Entrar</h1>
          <p className="text-[13px] text-[var(--sub)] mt-1 mb-6">Aceda ao painel de operação da Eporifrutas.</p>

          <form onSubmit={submit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold mb-1.5 tracking-wide text-[var(--muted)]">EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="utilizador@eporifrutas.pt"
                className="w-full rounded-[10px] px-3.5 py-2.5 text-[13px] outline-none ring-focus"
                style={{ border: `1px solid ${T.line}`, backgroundColor: '#fff', color: T.ink }} />
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1.5 tracking-wide text-[var(--muted)]">PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full rounded-[10px] px-3.5 py-2.5 text-[13px] outline-none ring-focus"
                style={{ border: `1px solid ${T.line}`, backgroundColor: '#fff', color: T.ink }} />
            </div>
            {error && <p className="text-[12px] font-medium py-2 px-3 rounded-lg" style={{ color: '#B23A20', backgroundColor: T.tomatoSoft }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 ring-focus inline-flex items-center justify-center gap-1.5"
              style={{ background: 'linear-gradient(180deg,#22995A,#1B8A4B)' }}>
              {loading ? 'A entrar…' : <>Entrar <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="mt-7">
            <p className="text-[10px] font-bold tracking-[0.16em] mb-2.5 text-[var(--muted)]">CONTAS DEMO — CLIQUE PARA PREENCHER</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map(u => (
                <button key={u.id} onClick={() => fill(u)} type="button"
                  className="text-left p-2.5 rounded-[10px] transition-all card-hover" style={{ border: `1px solid ${T.line}`, backgroundColor: '#fff' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: T.brand, color: '#fff' }}>{u.avatar}</div>
                    <span className="text-[12px] font-semibold truncate" style={{ color: T.ink }}>{u.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: T.brandSoft, color: T.brandDark }}>{ROLE_LABELS[u.role]}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] font-mono mt-3 text-center text-[var(--muted)]">password: <b style={{ color: T.sub }}>epori</b></p>
          </div>
        </div>
      </div>
    </div>
  )
}
