import { getDetailTournament } from '@/lib/api/tour'
import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/context/auth-context'

export const useGetDetailTournament = (slug: string) => {
  const { user } = useAuth()
  const token = user?.accessToken ?? null

  return useQuery({
    queryKey: ['detail-tournament', slug, token],
    queryFn: () => getDetailTournament(slug, token || undefined),
    enabled: !!slug,
  })
}
