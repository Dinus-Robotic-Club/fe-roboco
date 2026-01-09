import { getPlayoff } from '@/lib/api/playoff'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetPlayoff = (tournamentId: string) => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useQuery({
    queryKey: ['get-playoff', tournamentId, token],
    queryFn: () => getPlayoff(tournamentId, token || undefined),
    enabled: !!tournamentId,
  })
}
