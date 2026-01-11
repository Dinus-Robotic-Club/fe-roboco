import { getAllMatchOnGoing } from '@/lib/api/match'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetOnGoingMatch = (enabled: boolean = true) => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useQuery({
    queryKey: ['all-ongoing-match'],
    queryFn: () => getAllMatchOnGoing(token || undefined),
    enabled: enabled,
  })
}
