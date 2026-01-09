import { getTeamDashboard } from '@/lib/api/team'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useTeamDashboard = () => {
  return useSuspenseQuery({
    queryKey: ['dashboard-teams'],
    queryFn: getTeamDashboard,
  })
}
