import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ICustomJWT, IUser } from '@/lib/types/auth'

const JWT_SECRET = process.env.JWT_SECRET!

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi')
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await res.json()

          if (!res.ok || !data.success) {
            throw new Error(data.message || data.error || 'Login gagal')
          }

          const access_token = data.data.token

          if (!access_token) {
            throw new Error('Token tidak ditemukan')
          }

          const verified = jwt.verify(access_token, JWT_SECRET) as JwtPayload

          return {
            id: verified.uid,
            uidUser: verified.uid,
            email: verified.email,
            name: verified.name,
            role: verified.role,
            accessToken: access_token,
          } as IUser
        } catch (err) {
          console.error('Authorize error:', err)

          if (err instanceof Error) {
            throw new Error(err.message)
          }

          throw new Error('Terjadi kesalahan saat login')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const customToken = token as ICustomJWT

      if (user) {
        const u = user as IUser
        customToken.uidUser = u.uidUser
        customToken.email = u.email ?? undefined
        customToken.name = u.name
        customToken.role = u.role
        customToken.accessToken = u.accessToken
      }

      return customToken
    },
    async session({ session, token }) {
      const customToken = token as ICustomJWT

      if (session.user && customToken) {
        session.user.uidUser = customToken.uidUser
        session.user.email = customToken.email ?? null
        session.user.name = customToken.name ?? null
        session.user.role = customToken.role ?? null
        session.accessToken = customToken.accessToken
      }

      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 1,
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
