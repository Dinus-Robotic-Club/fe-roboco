// Manual auth utilities - NextAuth has been removed
// This file is kept for compatibility but all auth logic is now in:
// - /lib/utils/auth-cookie.ts (cookie utilities)
// - /context/auth-context.tsx (auth context/provider)

export { getAuthToken, getUserData, setAuthToken, removeAuthToken } from '@/lib/utils/auth-cookie'
