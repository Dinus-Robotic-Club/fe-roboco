import { IApiResponse, TournamentResponse } from '../types/type'
import { apiFetch } from './client'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const getAllTournaments = () => {
    return apiFetch<TournamentResponse>(`${BASE}/tournament/get`)
}


export const createTournament = (data: FormData): Promise<IApiResponse<unknown>> => {
    return apiFetch<IApiResponse<unknown>>(`${BASE}/tournament/create`, {
        method: 'POST',
        body: data,
    })
}

export const updateTournament = (uid: string, data: FormData): Promise<IApiResponse<unknown>> => {
    return apiFetch<IApiResponse<unknown>>(`${BASE}/tournament/update/${uid}`, {
        method: 'PUT',
        body: data,
    })
}

export const getDetailTournament = (slug: string): Promise<IApiResponse<unknown>> => {
    return apiFetch<IApiResponse<unknown>>(`${BASE}/tournament/get/${slug}`)
}

export const updateSetting = (tourId: string, data: string): Promise<IApiResponse<unknown>> => {
    return apiFetch<IApiResponse<unknown>>(`${BASE}/tournament/${tourId}/settings/update`, {
        method: 'PUT',
        body: data,
    })
}

export const deleteTournament = (uid: string): Promise<IApiResponse<unknown>> => {
    return apiFetch<IApiResponse<unknown>>(`${BASE}/tournament/delete/${uid}`, {
        method: 'DELETE',
    })
}
