import { apiFetch } from './client'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const createTeams = (data: FormData) => {
    return apiFetch<any>(`${BASE}/teams/registration`, {
        method: 'POST',
        body: data,
    })
}
