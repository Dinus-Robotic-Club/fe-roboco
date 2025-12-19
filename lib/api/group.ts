import { IGroupData } from '../types/group'
import { IApiResponse } from '../types/type'
import { apiFetch } from './client'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const getAllGroup = (tur: string): Promise<IApiResponse<IGroupData[]>> => {
  return apiFetch<IApiResponse<IGroupData[]>>(`${BASE}/api/groups/get/${tur}`)
}
