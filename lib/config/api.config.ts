import Cookies from 'js-cookie'

interface ApiFetchOptions extends RequestInit {
  token?: string
}

const ACCESS_TOKEN_KEY = 'accessToken'

export async function apiFetch<T>(url: string, options?: ApiFetchOptions): Promise<T> {
  // Get token from options or from cookies (client-side)
  let token = options?.token

  if (token === undefined && typeof window !== 'undefined') {
    token = Cookies.get(ACCESS_TOKEN_KEY)
  }

  const isFormData = options?.body instanceof FormData

  // [🌐 API REQUEST] Logger
  if (process.env.NODE_ENV === 'development') {
    console.log(`[🌐 API REQUEST] URL: ${url} Time: ${new Date().toLocaleTimeString()}`)
  }

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
