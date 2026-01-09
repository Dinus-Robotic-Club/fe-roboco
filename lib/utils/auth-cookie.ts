'use client'

import Cookies from 'js-cookie'

// Cookie Names
const ACCESS_TOKEN_KEY = 'accessToken'
const USER_DATA_KEY = 'userData'

// Cookie Expiry (30 days)
const COOKIE_EXPIRY_DAYS = 30

export interface IUserData {
  uidUser: string
  email?: string | null
  name?: string | null
  role?: string | null
}

/**
 * Set auth token and user data in cookies
 */
export const setAuthToken = (token: string, userData: IUserData): void => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: COOKIE_EXPIRY_DAYS,
    secure: false,
    sameSite: 'lax',
  })

  Cookies.set(USER_DATA_KEY, JSON.stringify(userData), {
    expires: COOKIE_EXPIRY_DAYS,
    secure: false,
    sameSite: 'lax',
  })
}

/**
 * Get auth token from cookies
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

/**
 * Get user data from cookies
 */
export const getUserData = (): IUserData | null => {
  const userDataStr = Cookies.get(USER_DATA_KEY)
  if (!userDataStr) return null

  try {
    return JSON.parse(userDataStr) as IUserData
  } catch {
    return null
  }
}

/**
 * Remove auth token and user data (Logout)
 */
export const removeAuthToken = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(USER_DATA_KEY)
}

/**
 * Check if user is authenticated (has token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
