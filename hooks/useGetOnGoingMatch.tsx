import { getAllMatchOnGoing } from '@/lib/api/match'
import { useSuspenseQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetOnGoingMatch = () => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useSuspenseQuery({
    queryKey: ['all-ongoing-match'],
    queryFn: () => getAllMatchOnGoing(token || undefined),
  })
}
