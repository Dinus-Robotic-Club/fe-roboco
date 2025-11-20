import { IApiResponse } from '../types/type'
import { apiFetch } from './client'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const createTeams = (data: FormData): Promise<IApiResponse<unknown>> => {
    return apiFetch<IApiResponse<unknown>>(`${BASE}/teams/registration`, {
        method: 'POST',
        body: data,
    })
}
