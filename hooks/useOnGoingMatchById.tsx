import { getAllMatchOnGoingById } from '@/lib/api/match'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetOnGoingMatchById = () => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useQuery({
    queryKey: ['ongoing-match-id', token],
    queryFn: () => getAllMatchOnGoingById(token || undefined),
    enabled: true,
  })
}
