import { getPlayoff } from '@/lib/api/playoff'
import { useSuspenseQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetPlayoff = (tournamentId: string) => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useSuspenseQuery({
    queryKey: ['get-playoff', tournamentId, token],
    queryFn: () => getPlayoff(tournamentId, token || undefined),
  })
}
