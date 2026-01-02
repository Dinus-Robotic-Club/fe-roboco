import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// ==============================================================================
// 1. KONFIGURASI PRIVATE ROUTES (STRICT MODE)
// ==============================================================================
// Format: Path awalan -> Array Role yang BOLEH masuk.
// Halaman yang TIDAK ada di sini otomatis dianggap PUBLIC.
const PRIVATE_ROUTES = [
  { path: '/admin', roles: ['ADMIN'] },
  { path: '/refree', roles: ['REFREE', 'ADMIN'] }, // Sesuaikan casing role lo (UPPERCASE/lowercase)
  { path: '/pendaf', roles: ['PENDAF', 'ADMIN'] },
  { path: '/user', roles: ['PARTICIPANT', 'PENDAF', 'REFREE', 'ADMIN'] },
  { path: '/dashboard', roles: ['PARTICIPANT', 'ADMIN'] }, // Contoh tambahan
  { path: '/uploads', roles: ['PARTICIPANT', 'PENDAF', 'REFREE', 'ADMIN'] },
]

// ==============================================================================
// 2. KONFIGURASI RATE LIMIT & BOT
// ==============================================================================
const rateLimitMap = new Map()
const LIMIT_TIME_WINDOW = 60 * 1000
const MAX_REQUESTS = 100

const GOOD_BOTS = ['googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'facebot', 'twitterbot']

// ==============================================================================
// 3. HELPER FUNCTIONS
// ==============================================================================
const getIP = (req: NextRequest) => {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return req.ip || '127.0.0.1'
}

const isSearchEngineBot = (req: NextRequest): boolean => {
  const ua = req.headers.get('user-agent')?.toLowerCase() || ''
  return GOOD_BOTS.some((bot) => ua.includes(bot))
}

// ==============================================================================
// 4. MAIN MIDDLEWARE LOGIC
// ==============================================================================
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = getIP(req)
  const isBot = isSearchEngineBot(req)

  // --- A. RATE LIMITER ---
  if (!isBot) {
    const now = Date.now()
    const windowStart = now - LIMIT_TIME_WINDOW
    const requestHistory = rateLimitMap.get(ip) || []
    const activeRequests = requestHistory.filter((timestamp: number) => timestamp > windowStart)

    if (activeRequests.length >= MAX_REQUESTS) {
      console.warn(`[RATE LIMIT] IP: ${ip} blocked accessing ${pathname}`)
      return new NextResponse(JSON.stringify({ success: false, message: 'Too many requests.' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      })
    }
    activeRequests.push(now)
    rateLimitMap.set(ip, activeRequests)
  }

  // --- B. AUTHENTICATION & RBAC (STRICT) ---

  // 1. Cek apakah route ini ada di daftar PRIVATE_ROUTES
  const protectedRoute = PRIVATE_ROUTES.find((route) => pathname.startsWith(route.path))

  // Siapkan variable response default (Next/Allow)
  let response = NextResponse.next()

  if (protectedRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    console.log(token?.role)

    // Case 2a: Belum Login (Token null) -> Redirect Login
    if (!token) {
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('callbackUrl', encodeURI(req.url))
      response = NextResponse.redirect(loginUrl)
    }
    // Case 2b: Sudah Login -> Cek Role
    else {
      const userRole = (token.role as string) || 'GUEST'

      const isAllowed = protectedRoute.roles.includes(userRole)

      if (!isAllowed) {
        console.warn(`[ACCESS DENIED] User: ${token.email} Role: [${userRole}] tried accessing: [${pathname}]`)
        // Redirect ke halaman 403 Forbidden
        response = NextResponse.rewrite(new URL('/403', req.url))
      }
      // Jika allowed, response tetap NextResponse.next() (default)
    }
  }

  // --- C. SECURITY HEADERS ---
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
