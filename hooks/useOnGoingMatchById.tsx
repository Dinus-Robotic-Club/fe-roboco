import { getAllMatchOnGoingById } from '@/lib/api/match'
import { useSuspenseQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetOnGoingMatchById = () => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useSuspenseQuery({
    queryKey: ['ongoing-match-id', token],
    queryFn: () => getAllMatchOnGoingById(token || undefined),
  })
}
