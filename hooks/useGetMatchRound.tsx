import { getMatchRound } from '@/lib/api/match'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetMatchRound = (matchId: string) => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useQuery({
    queryKey: ['match-round', matchId, token],
    queryFn: () => getMatchRound(matchId, token || undefined),
    enabled: !!matchId,
  })
}
