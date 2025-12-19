import { IApiResponse } from '../types/type'
import { apiFetch } from './client'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const getAllMatchOnGoing = (): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/matches/ongoing`, {
    method: 'GET',
  })
}

export const getAllMatchHistory = (): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/matches/history`, {
    method: 'GET',
  })
}

export const getAllMatchOnGoingById = (): Promise<ICardMatchResp> => {
  return apiFetch<ICardMatchResp>(`${BASE}/api/matches/team/ongoing`, {
    method: 'GET',
  })
}

export const getAllMatchHistoryById = (): Promise<ICardMatchResp> => {
  return apiFetch<ICardMatchResp>(`${BASE}/api/matches/team/history`, {
    method: 'GET',
  })
}
