// Auth types - Manual implementation (NextAuth removed)

export interface IAuthUser {
  uidUser: string
  email?: string | null
  name?: string | null
  role?: string | null
  accessToken?: string
}

export type IAuthContext = {
  isAuthenticated: boolean
  isLoading: boolean
  user: IAuthUser | null
  login: (token: string, userData: { uidUser: string; email?: string | null; name?: string | null; role?: string | null }) => void
  logout: () => void
}

export interface ILoginError {
  email?: string
  password?: string
  general?: string
}
