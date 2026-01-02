import { getMatchRound } from '@/lib/api/match'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useGetMatchRound = (matchId: string) => {
  return useSuspenseQuery({
    queryKey: ['match-round', matchId],
    queryFn: () => getMatchRound(matchId),
  })
}
