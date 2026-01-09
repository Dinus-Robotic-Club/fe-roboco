import { getAllMatchHistoryById } from '@/lib/api/match'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetHistoryMatchById = () => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useQuery({
    queryKey: ['history-match-id', token],
    queryFn: () => getAllMatchHistoryById(token || undefined),
    enabled: true,
  })
}
