import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ==============================================================================
// 1. KONFIGURASI ROUTES
// ==============================================================================

// Routes yang HANYA boleh diakses tamu (kalau dah login, tendang ke dashboard)
const AUTH_ROUTES = ['/auth/login', '/auth/register']

// Routes yang BUTUH login (Prefix-based)
// Definisikan path dan role yang diizinkan
const PRIVATE_ROUTES = [
  // Specific Admin Routes (ORDER MATTERS: More specific first)
  { path: '/admin/refree', roles: ['ADMIN', 'REFREE', 'REFEREE'] },
  { path: '/admin/pendaf', roles: ['ADMIN', 'PENDAF'] },
  { path: '/admin/dashboard', roles: ['ADMIN'] }, // Specific admin dashboard
  { path: '/admin', roles: ['ADMIN'] }, // General admin fallback

  // User Dashboard - Only PARTICIPANT
  { path: '/dashboard', roles: ['PARTICIPANT'] },

  // Shared routes
  { path: '/user', roles: ['PARTICIPANT', 'PENDAF', 'REFREE', 'REFEREE', 'ADMIN'] },
  { path: '/uploads', roles: ['PARTICIPANT', 'PENDAF', 'REFREE', 'REFEREE', 'ADMIN'] },
]

// Cookie Names
const ACCESS_TOKEN_KEY = 'accessToken'
const USER_DATA_KEY = 'userData'

// ==============================================================================
// 2. HELPER FUNCTIONS
// ==============================================================================
const getUserRole = (req: NextRequest): string | null => {
  const userDataCookie = req.cookies.get(USER_DATA_KEY)?.value
  if (!userDataCookie) return null
  try {
    const data = JSON.parse(userDataCookie)
    return data.role || null
  } catch {
    return null
  }
}

// ==============================================================================
// 3. MAIN MIDDLEWARE LOGIC
// ==============================================================================
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get(ACCESS_TOKEN_KEY)?.value
  const userRole = getUserRole(req)

  // --- A. IGNORE ASSETS & API ---
  // Jangan proses middleware untuk file statis atau API internal Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // file extension like .svg, .png
  ) {
    return NextResponse.next()
  }

  // --- B. AUTH ROUTE HANDLING (Login/Register) ---
  // Jika user sudah login tapi coba buka /auth/login, redirect ke Dashboard
  if (token && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    // Tentukan tujuan redirect berdasarkan role (Optional Logic)
    let redirectUrl = '/dashboard'
    if (userRole === 'ADMIN') redirectUrl = '/admin'

    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }

  // --- C. PRIVATE ROUTE HANDLING ---
  // Cari apakah path yang diakses termasuk private
  const protectedRoute = PRIVATE_ROUTES.find((route) => pathname.startsWith(route.path))

  if (protectedRoute) {
    // 1. Jika TIDAK ADA token (Belum Login) -> Redirect ke Login
    if (!token) {
      const loginUrl = new URL('/auth/login', req.url)
      // Simpan URL asal agar bisa redirect balik setelah login
      loginUrl.searchParams.set('callbackUrl', encodeURI(pathname))
      return NextResponse.redirect(loginUrl)
    }

    // 2. Jika ADA token, tapi Role tidak sesuai (Forbidden)
    const isAllowed = userRole && protectedRoute.roles.includes(userRole)

    if (!isAllowed) {
      let targetUrl = '/dashboard'

      if (userRole === 'ADMIN') {
        targetUrl = '/admin/dashboard'
      } else if (userRole === 'REFREE' || userRole === 'REFEREE') {
        targetUrl = '/admin/refree/match'
      } else if (userRole === 'PENDAF') {
        targetUrl = '/admin/pendaf'
      }

      // Hindari loop redirect jika targetUrl sama dengan current path
      if (!pathname.startsWith(targetUrl)) {
        return NextResponse.redirect(new URL(targetUrl, req.url))
      }
      // Jika sudah di targetUrl tapi masih forbidden (konfigurasi salah?), biarkan (atau 403)
      // Idealnya konfigurasi routes harus sinkron dengan logika ini.
    }
  }

  // --- D. FINAL RESPONSE & HEADERS ---
  const response = NextResponse.next()

  // Security Headers (Standard Practice)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  // Matcher lebih spesifik agar tidak membebani server
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
