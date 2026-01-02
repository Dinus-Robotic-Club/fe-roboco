import 'next-auth'
import 'next-auth/jwt'
import type { User as NextAuthUser } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

interface IAuthUser {
  uidUser?: string | null
  email?: string | null
  name?: string | null
  role?: string | null
}

type IAuthContext = {
  isAuthenticated: boolean
  isLoading: boolean
  user: IAuthUser | null
}

declare module 'next-auth' {
  interface Session {
    user: {
      uidUser: string
      email?: string | null
      name?: string | null
      role: string | null
    }
    accessToken?: string
  }

  interface IUser {
    uidUser: string
    email: string
    name: string
    role: string
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uidUser?: string
    email?: string
    name?: string
    role?: string
    accessToken?: string
  }
}

interface IUser extends NextAuthUser {
  uidUser: string
  email: string
  name: string
  role: string
  accessToken: string
}

interface ICustomJWT extends JWT {
  uidUser: string
  email?: string
  name?: string
  role?: string
  accessToken?: string
}

interface ILoginError {
  email?: string
  password?: string
  general?: string
}
