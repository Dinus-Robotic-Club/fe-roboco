interface IResponseLogin {
    succes: boolean
    message: string
    data: {
        token: string
    }
}

interface IRequestLogin {
    email: string
    password: string
}

interface IRequestForgotPassword {
    email: string
}

interface IRequestResetPassword {
    newPassword: string
}

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
