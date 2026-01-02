import { apiFetch } from '../config/api.config'
import { IApiResponse } from '../types'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const getAllGroup = (tur: string): Promise<IApiResponse<IGroupData[]>> => {
  return apiFetch<IApiResponse<IGroupData[]>>(`${BASE}/api/groups/get/${tur}`)
}

export const createGroup = (tourId: string): Promise<IApiResponse<unknown>> => {
  return apiFetch<IApiResponse<unknown>>(`${BASE}/api/groups/create/${tourId}`, {
    method: 'POST',
  })
}
