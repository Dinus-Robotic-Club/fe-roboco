import { getAllTournaments } from '@/lib/api/tour'
import { useQuery } from '@tanstack/react-query'

export const useGetTournaments = () => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: getAllTournaments,
    enabled: true,
  })
}
