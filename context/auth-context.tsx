'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { createContext, ReactNode, useContext } from 'react'

interface IAuthUser {
    uidUser: string
    email?: string | null
    name?: string | null
}

interface IAuthContext {
    isAuthenticated: boolean
    isLoading: boolean
    user: IAuthUser | null
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    return (
        <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
            <AuthContextProvider>{children}</AuthContextProvider>
        </SessionProvider>
    )
}

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession()

    const value: IAuthContext = {
        isAuthenticated: status === 'authenticated' && !!session?.user,
        isLoading: status === 'loading',
        user: session?.user
            ? {
                  uidUser: session.user.uidUser,
                  email: session.user.email,
                  name: session.user.name,
              }
            : null,
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
