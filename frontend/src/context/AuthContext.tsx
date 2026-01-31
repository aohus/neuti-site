'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAdmin: boolean
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      setToken(savedToken)
      setIsAdmin(true)
    }
  }, [])

  const login = (newToken: string) => {
    setToken(newToken)
    setIsAdmin(true)
    localStorage.setItem('admin_token', newToken)
  }

  const logout = () => {
    setToken(null)
    setIsAdmin(false)
    localStorage.removeItem('admin_token')
  }

  return (
    <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
