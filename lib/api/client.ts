import { getSession } from 'next-auth/react'

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const session = await getSession()
    const token = session?.accessToken
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

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        throw new Error(errorBody?.message || `API Error: ${res.status}`)
    }

    return res.json() as Promise<T>
}
