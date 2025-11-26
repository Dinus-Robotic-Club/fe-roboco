import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: {
            uidUser: string
            email?: string | null
            name?: string | null
        }
        accessToken?: string
    }

    interface User {
        uidUser: string
        email: string
        name: string
        accessToken: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        uidUser?: string
        email?: string
        name?: string
        accessToken?: string
    }
}
