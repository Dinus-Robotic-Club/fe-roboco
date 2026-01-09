import { getAllTeam } from '@/lib/api/team'
import { useQuery } from '@tanstack/react-query'

export const useGetAllTeams = () => {
  return useQuery({
    queryKey: ['get-all-teams'],
    queryFn: getAllTeam,
    enabled: true,
  })
}
