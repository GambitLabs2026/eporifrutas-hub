// layout · root layout da app Eporifrutas Hub · next/font/google, globals.css, AuthProvider
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Eporifrutas Ops Hub — Receção, Conferência & Cobranças',
  description: 'Camada pré-PHC: receção inteligente de encomendas, conferência receção vs. faturação, conta-corrente e análise — Eporifrutas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className="h-full">
      <body className={`${geist.className} h-full`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
