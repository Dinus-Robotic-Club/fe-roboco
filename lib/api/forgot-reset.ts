import { IApiResponse } from '../types/type'
import { apiFetch } from './client'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const forgotPassword = async (email: string): Promise<IApiResponse<unknown>> => {
    return await apiFetch(`${BASE}/api/auth/user/forgot-password`, {
        method: 'POST',
        body: JSON.stringify({ email }),
    })
}

export const resetPassword = async (token: string, newPassword: string): Promise<IApiResponse<unknown>> => {
    return await apiFetch(`${BASE}/api/auth/user/reset-password?token=${token}`, {
        method: 'POST',
        body: JSON.stringify({ newPassword: newPassword }),
    })
}
