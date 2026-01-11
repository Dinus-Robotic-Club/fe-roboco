import { getMatchesByReferee } from '@/lib/api/match'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/auth-context'

export const useGetMatchReferee = () => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useQuery({
    queryKey: ['referee-matches', token],
    queryFn: () => getMatchesByReferee(token || undefined),
    enabled: !!token && user?.role === 'REFREE',
  })
}
