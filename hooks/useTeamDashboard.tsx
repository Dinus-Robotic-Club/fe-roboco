import { getTeamDashboard } from '@/lib/api/team'
import { useQuery } from '@tanstack/react-query'

export const useTeamDashboard = () => {
  return useQuery({
    queryKey: ['dashboard-teams'],
    queryFn: getTeamDashboard,
    enabled: true,
  })
}
