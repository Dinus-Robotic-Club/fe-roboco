import { getAllMatchHistory } from '@/lib/api/match'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetHistoryMatch = () => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useQuery({
    queryKey: ['all-history-match', token],
    queryFn: () => getAllMatchHistory(token || undefined),
    enabled: true,
  })
}
