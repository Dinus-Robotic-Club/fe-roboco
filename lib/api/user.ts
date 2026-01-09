import { apiFetch } from '../config/api.config'
import { IApiResponse } from '../types'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const getAllUser = () => {
  return apiFetch<IApiResponse<IUser[]>>(`${BASE}/api/user/get-all`, {
    method: 'GET',
  })
}

export const createUser = (data: IRegisterUserInput) => {
  return apiFetch<IApiResponse<IUser[]>>(`${BASE}/api/auth/admin/register`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
