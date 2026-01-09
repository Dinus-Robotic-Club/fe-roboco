import { getAllTeam } from '@/lib/api/team'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useGetAllTeams = () => {
  return useSuspenseQuery({
    queryKey: ['get-all-teams'],
    queryFn: getAllTeam,
  })
}
