import { getMatchRound } from '@/lib/api/match'
import { useSuspenseQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetMatchRound = (matchId: string) => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useSuspenseQuery({
    queryKey: ['match-round', matchId, token],
    queryFn: () => getMatchRound(matchId, token || undefined),
  })
}
