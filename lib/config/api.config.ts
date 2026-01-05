// utils/api-fetch.ts
import { getSession } from 'next-auth/react'

// Tambahkan properti token di options
interface ApiFetchOptions extends RequestInit {
  token?: string
}

export async function apiFetch<T>(url: string, options?: ApiFetchOptions): Promise<T> {
  let token = options?.token

  if (!token) {
    const session = await getSession()
    token = session?.accessToken
  }

  const isFormData = options?.body instanceof FormData

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  })

  // ... error handling
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody?.message || `API Error: ${res.status}`)
  }

  return res.json() as Promise<T>
}
