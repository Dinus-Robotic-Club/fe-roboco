import { apiFetch } from '../config/api.config'

const BASE = process.env.NEXT_PUBLIC_API_URL

export const generateTwibbon = (data: FormData): Promise<unknown> => {
  return apiFetch(`${BASE}/image/remove`, {
    method: 'POST',
    body: data,
  })
}
