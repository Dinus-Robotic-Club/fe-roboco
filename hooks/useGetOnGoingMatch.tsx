import { getAllMatchOnGoing } from '@/lib/api/match'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

import { useEffect } from 'react'

export const useGetOnGoingMatch = () => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  // [🪝 HOOK TRIGGER] Logger

  useEffect(() => {
    console.log('[🪝 HOOK TRIGGER] File:useGetOnGoingMatch.tsx Hook:useGetOnGoingMatch triggered by:', { token })
  }, [token])

  return useQuery({
    queryKey: ['all-ongoing-match'],
    queryFn: () => {
      console.log('[📡 QUERY] Key: all-ongoing-match Time:', new Date().toLocaleTimeString())
      return getAllMatchOnGoing(token || undefined)
    },
    enabled: true, // Always enable, let it fetch
  })
}
