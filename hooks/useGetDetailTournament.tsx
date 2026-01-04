import { getDetailTournament } from '@/lib/api/tour'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useGetDetailTournament = (slug: string) => {
  return useSuspenseQuery({
    queryKey: ['detail-tournament', slug],
    queryFn: () => getDetailTournament(slug),
  })
}
