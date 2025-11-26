import { IApiResponse } from '../types/type'
import { apiFetch } from './client'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const generateTwibbon = (data: FormData): Promise<IApiResponse<unknown>> => {
    return apiFetch<IApiResponse<unknown>>(`${BASE}/image/remove`, {
        method: 'POST',
        body: data,
    })
}
