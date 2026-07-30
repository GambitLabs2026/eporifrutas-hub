'use client'
// auth-context.tsx · context de autenticação demo · demo-auth

import { createContext, useContext, useEffect, useState } from 'react'
import { DemoUser, getDemoUser, logoutDemo } from '@/lib/auth/demo-auth'

interface AuthContextValue {
  user: DemoUser | null
  loading: boolean
  signOut: () => void
  setUser: (u: DemoUser | null) => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null, loading: true, signOut: () => {}, setUser: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getDemoUser())
    setLoading(false)
  }, [])

  const signOut = () => {
    logoutDemo()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
