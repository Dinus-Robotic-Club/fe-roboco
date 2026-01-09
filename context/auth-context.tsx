'use client'

import { createContext, ReactNode, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, getUserData, setAuthToken, removeAuthToken, IUserData } from '@/lib/utils/auth-cookie'

export interface IAuthUser extends IUserData {
  accessToken?: string
}

interface IAuthContext {
  isAuthenticated: boolean
  isLoading: boolean
  user: IAuthUser | null
  login: (token: string, userData: IUserData) => void
  logout: () => void
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<IAuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true) // True only during initial mount

  // On Mount: Read token/user from cookies (ONE TIME ONLY)
  useEffect(() => {
    const token = getAuthToken()
    const userData = getUserData()

    if (token && userData) {
      setUser({
        ...userData,
        accessToken: token,
      })
    }

    // Mark loading as complete
    setIsLoading(false)

    if (process.env.NODE_ENV === 'development') {
      console.log('[🔐 AUTH INIT]', {
        hasToken: !!token,
        hasUser: !!userData,
        time: new Date().toLocaleTimeString(),
      })
    }
  }, [])

  // Login function: Sets cookies and updates state immediately
  const login = useCallback((token: string, userData: IUserData) => {
    setAuthToken(token, userData)
    setUser({
      ...userData,
      accessToken: token,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('[🔐 AUTH LOGIN]', { user: userData })
    }
  }, [])

  // Logout function: Clears cookies, clears state, redirects
  const logout = useCallback(() => {
    removeAuthToken()
    setUser(null)

    if (process.env.NODE_ENV === 'development') {
      console.log('[🔐 AUTH LOGOUT]')
    }

    router.push('/auth/login')
  }, [router])

  const value: IAuthContext = {
    isAuthenticated: !!user,
    isLoading,
    user,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
