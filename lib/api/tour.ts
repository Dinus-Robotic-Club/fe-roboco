import { apiFetch } from '../config/api.config'
import { IApiResponse } from '../types'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const getAllTournaments = (): Promise<IApiResponse<IGetAllTournaments[]>> => {
  return apiFetch<IApiResponse<IGetAllTournaments[]>>(`${BASE}/api/tournament/get`)
}

export const createTournament = (data: FormData): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/tournament/create`, {
    method: 'POST',
    body: data,
  })
}

export const updateTournament = (uid: string, data: FormData): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/tournament/update/${uid}`, {
    method: 'PUT',
    body: data,
  })
}

export const getDetailTournament = (slug: string): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/tournament/get/${slug}`, {
    method: 'GET',
  })
}

export const updateSetting = (tourId: string, data: string): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/tournament/${tourId}/settings/update`, {
    method: 'PUT',
    body: data,
  })
}

export const deleteTournament = (uid: string): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/tournament/delete/${uid}`, {
    method: 'DELETE',
  })
}
